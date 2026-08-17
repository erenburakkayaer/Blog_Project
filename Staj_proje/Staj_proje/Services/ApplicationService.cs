using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.DTO.Application;
using Staj_proje.Entities;
using Staj_proje.Interfaces;
using Mapster;

namespace Staj_proje.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly AppDbContext _dbContext;

        public ApplicationService(IApplicationRepository applicationRepository, AppDbContext dbContext)
        {
            _applicationRepository = applicationRepository;
            _dbContext = dbContext;
        }

        public async Task<ApplicationResponseDto> CreateAsync(ApplicationCreateDto dto, int? userId)
        {
            if (string.IsNullOrWhiteSpace(dto.ResumeFilePath))
                throw new BusinessException("Özgeçmiş dosya yolu zorunludur.");

            // Basit business kontrollü: aynı kullanıcı aynı ilana tekrar başvurmasın (isteğe göre kaldırılabilir)
            if (userId.HasValue)
            {
                var existing = await _applicationRepository.FindAsync(a => a.CareerId == dto.CareerId && a.UserId == userId.Value && !a.IsDeleted);
                if (existing.Any())
                    throw new BusinessException("Bu kullanıcı aynı ilana zaten başvurmuş.");
            }

            var application = new Application
            {
                CareerId = dto.CareerId,
                UserId = userId,
                LinkedInUrl = dto.LinkedInUrl ?? string.Empty,
                GitHubUrl = dto.GitHubUrl ?? string.Empty,
                PortfolioUrl = dto.PortfolioUrl ?? string.Empty,
                CoverLetter = dto.CoverLetter ?? string.Empty,
                ResumeFilePath = dto.ResumeFilePath,
                Status = ApplicationStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            await _applicationRepository.AddAsync(application); await _dbContext.SaveChangesAsync(); // navigation prop'lar gerekli olduğu için detaylı kaydı tekrar al
            var created = await _applicationRepository.GetApplicationWithDetailsByIdAsync(application.Id); 
            return created!.Adapt<ApplicationResponseDto>();
        }

        public async Task<ApplicationResponseDto?> GetByIdAsync(int id)
        {
            var app = await _applicationRepository.GetApplicationWithDetailsByIdAsync(id);
            if (app == null) return null;
            return app.Adapt<ApplicationResponseDto>();
        }

        public async Task<List<ApplicationResponseDto>> GetPendingApplicationsAsync()
        {
            var list = await _applicationRepository.GetPendingApplicationsWithDetailsAsync();
            return list.Select(a => a.Adapt<ApplicationResponseDto>()).ToList();
        }

        public async Task<List<ApplicationResponseDto>> GetByCareerIdAsync(int careerId)
        {
            var list = await _applicationRepository.GetApplicationsByCareerIdAsync(careerId);
            return list.Select(MapToResponse).ToList();
        }

        public async Task<List<ApplicationResponseDto>> GetByUserIdAsync(int userId)
        {
            var list = await _applicationRepository.GetApplicationsByUserIdAsync(userId);
            return list.Select(MapToResponse).ToList();
        }

        public async Task UpdateAsync(int id, ApplicationUpdateDto dto, int? userId)
        {
            var app = await _applicationRepository.GetByIdAsync(id);
            if (app == null) throw new KeyNotFoundException("Başvuru bulunamadı.");

            // Sadece başvuran kendi başvurusunu güncelleyebilir (admin yetkisi yoksa)
            if (app.UserId.HasValue && userId.HasValue && app.UserId != userId)
                throw new UnauthorizedAccessException("Bu başvuruyu güncelleme yetkiniz yok.");

            // İş kuralı: sadece Pending veya InReview aşamasındayken güncelleme yapılabilir.
            if (app.Status != ApplicationStatus.Pending && app.Status != ApplicationStatus.InReview)
                throw new BusinessException("Sadece Beklemede veya İnceleniyor durumundaki başvurular güncellenebilir.");

            if (dto.LinkedInUrl != null) app.LinkedInUrl = dto.LinkedInUrl;
            if (dto.GitHubUrl != null) app.GitHubUrl = dto.GitHubUrl;
            if (dto.PortfolioUrl != null) app.PortfolioUrl = dto.PortfolioUrl;
            if (dto.CoverLetter != null) app.CoverLetter = dto.CoverLetter;
            if (dto.ResumeFilePath != null) app.ResumeFilePath = dto.ResumeFilePath;

            _applicationRepository.Update(app);
            await _dbContext.SaveChangesAsync();
        }

        public async Task ChangeStatusAsync(int id, ApplicationStatus newStatus, int reviewerId, string? adminNotes = null)
        {
            var app = await _applicationRepository.GetByIdAsync(id);
            if (app == null) throw new KeyNotFoundException("Başvuru bulunamadı.");

            // Basit durum geçiş kontrolleri
            if (newStatus == ApplicationStatus.Approved || newStatus == ApplicationStatus.Hired)
            {
                // örnek: sadece InReview veya Pending'den approve/hire edilebilir
                if (app.Status != ApplicationStatus.Pending && app.Status != ApplicationStatus.InReview)
                    throw new BusinessException("Bu işlemi gerçekleştirmek için başvuru uygun durumda değil.");
            }

            if (newStatus == ApplicationStatus.Rejected)
            {
                if (app.Status != ApplicationStatus.Pending && app.Status != ApplicationStatus.InReview)
                    throw new BusinessException("Reddedilebilmesi için başvuru uygun durumda olmalıdır.");
            }

            app.Status = newStatus;
            app.ReviewedByUserId = reviewerId;
            app.ReviewedAt = DateTime.UtcNow;
            if (!string.IsNullOrWhiteSpace(adminNotes))
                app.AdminNotes = adminNotes;

            _applicationRepository.Update(app);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var app = await _applicationRepository.GetByIdAsync(id);
            if (app == null) throw new KeyNotFoundException("Başvuru bulunamadı.");

            // Soft delete uygula (GenericRepository.Remove soft delete yapıyorsa)
            _applicationRepository.Remove(app);
            await _dbContext.SaveChangesAsync();
        }

        public async Task RestoreAsync(int id)
        {
            var app = await _applicationRepository.GetByIdAsync(id);
            if (app == null) throw new KeyNotFoundException("Başvuru bulunamadı.");

            _applicationRepository.Restore(app);
            await _dbContext.SaveChangesAsync();
        }

        #region Helpers
        private ApplicationResponseDto MapToResponse(Application app)
        {
            return new ApplicationResponseDto
            {
                Id = app.Id,
                CareerId = app.CareerId,
                CareerTitle = app.Career?.Title ?? string.Empty,
                UserId = app.UserId,
                ApplicantName = app.User != null ? (app.User.FullName ?? app.User.UserName) : null,
                LinkedInUrl = string.IsNullOrWhiteSpace(app.LinkedInUrl) ? null : app.LinkedInUrl,
                GitHubUrl = string.IsNullOrWhiteSpace(app.GitHubUrl) ? null : app.GitHubUrl,
                PortfolioUrl = string.IsNullOrWhiteSpace(app.PortfolioUrl) ? null : app.PortfolioUrl,
                CoverLetter = string.IsNullOrWhiteSpace(app.CoverLetter) ? null : app.CoverLetter,
                ResumeFilePath = app.ResumeFilePath,
                Status = app.Status.ToString(),
                CreatedAt = app.CreatedAt
            };
        }
        #endregion
    }
}