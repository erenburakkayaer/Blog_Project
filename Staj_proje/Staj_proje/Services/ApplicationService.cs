using Mapster;
using Staj_proje.DTO.Application;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IGenericRepository<Career> _careerRepository;
        private readonly IGenericRepository<User> _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ApplicationService(
            IApplicationRepository applicationRepository,
            IGenericRepository<Career> careerRepository,
            IGenericRepository<User> userRepository,
            IUnitOfWork unitOfWork)
        {
            _applicationRepository = applicationRepository;
            _careerRepository = careerRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir başvuru oluşturur
        /// </summary>
        public async Task<ApplicationResponseDto> CreateAsync(ApplicationCreateDto dto, int? userId)
        {
            // İlan kontrolü
            var career = await _careerRepository.GetByIdAsync(dto.CareerId);
            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {dto.CareerId} bulunamadı.");

            // Kullanıcı kontrolü (varsa)
            if (userId.HasValue)
            {
                var user = await _userRepository.GetByIdAsync(userId.Value);
                if (user == null)
                    throw new InvalidOperationException($"Kullanıcı ID: {userId} bulunamadı.");
            }

            // Yeni Application nesnesi oluştur
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

            await _applicationRepository.AddAsync(application);
            await _unitOfWork.CommitAsync();

            // Detaylarıyla birlikte DTO'ya dönüştür
            var createdApplication = await _applicationRepository.GetApplicationWithDetailsByIdAsync(application.Id);
            return (createdApplication ?? application).Adapt<ApplicationResponseDto>();
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre başvuruyu tüm detaylarıyla getirir
        /// </summary>
        public async Task<ApplicationResponseDto?> GetByIdAsync(int id)
        {
            var application = await _applicationRepository.GetApplicationWithDetailsByIdAsync(id);

            if (application == null)
                return null;

            var result = application.Adapt<ApplicationResponseDto>();
            return result;
        }

        /// <summary>
        /// Beklemede/İncelenmede olan tüm başvuruları getirir
        /// </summary>
        public async Task<List<ApplicationResponseDto>> GetPendingApplicationsAsync()
        {
            var applications = await _applicationRepository.GetPendingApplicationsWithDetailsAsync();
            var result = applications.Adapt<List<ApplicationResponseDto>>();
            return result;
        }

        /// <summary>
        /// Belirli bir iş ilanına yapılan başvuruları getirir
        /// </summary>
        public async Task<List<ApplicationResponseDto>> GetByCareerIdAsync(int careerId)
        {
            // İlan kontrolü
            var career = await _careerRepository.GetByIdAsync(careerId);
            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {careerId} bulunamadı.");

            var applications = await _applicationRepository.GetApplicationsByCareerIdAsync(careerId);
            var result = applications.Adapt<List<ApplicationResponseDto>>();
            return result;
        }

        /// <summary>
        /// Belirli bir kullanıcının başvurularını getirir
        /// </summary>
        public async Task<List<ApplicationResponseDto>> GetByUserIdAsync(int userId)
        {
            // Kullanıcı kontrolü
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException($"Kullanıcı ID: {userId} bulunamadı.");

            var applications = await _applicationRepository.GetApplicationsByUserIdAsync(userId);
            var result = applications.Adapt<List<ApplicationResponseDto>>();
            return result;
        }

        /// <summary>
        /// Başvuru durumuna göre (Pending, InReview, Shortlisted, Rejected, Hired) başvuruları listeler
        /// </summary>
        public async Task<List<ApplicationResponseDto>> GetByStatusAsync(ApplicationStatus status)
        {
            var applications = await _applicationRepository.GetApplicationsByStatusAsync(status);
            var result = applications.Adapt<List<ApplicationResponseDto>>();
            return result;
        }

        #endregion

        #region UPDATE

        /// <summary>
        /// Başvuru bilgilerini günceller
        /// </summary>
        public async Task UpdateAsync(int id, ApplicationUpdateDto dto, int? userId)
        {
            var application = await _applicationRepository.GetByIdAsync(id);

            if (application == null)
                throw new InvalidOperationException($"Başvuru ID: {id} bulunamadı.");

            // Güvenlik kontrolü: Sadece başvuran kendisi veya admin güncelleyebilir
            if (userId.HasValue && application.UserId != userId && !await IsUserAdminAsync(userId.Value))
                throw new UnauthorizedAccessException("Bu başvuruyu güncelleme yetkiniz yok.");

            // Mapster ile güncelle (null değerler göz ardı edilir)
            dto.Adapt(application);

            _applicationRepository.Update(application);
            await _unitOfWork.CommitAsync();
        }

        /// <summary>
        /// Başvuru durumunu değiştirir
        /// </summary>
        public async Task ChangeStatusAsync(int id, ApplicationStatus newStatus, int reviewerId, string? adminNotes = null)
        {
            var application = await _applicationRepository.GetByIdAsync(id);

            if (application == null)
                throw new InvalidOperationException($"Başvuru ID: {id} bulunamadı.");

            // İnceleme yapan kullanıcıyı kontrol et
            var reviewer = await _userRepository.GetByIdAsync(reviewerId);
            if (reviewer == null)
                throw new InvalidOperationException($"İnceleme yapan kullanıcı ID: {reviewerId} bulunamadı.");

            // Aynı statüye geçişi engelle
            if (application.Status == newStatus)
                throw new InvalidOperationException($"Başvuru zaten {newStatus} durumunda.");

            // Başvuru durumunu güncelle
            application.Status = newStatus;
            application.ReviewedByUserId = reviewerId;
            application.ReviewedAt = DateTime.UtcNow;

            if (!string.IsNullOrWhiteSpace(adminNotes))
                application.AdminNotes = adminNotes;

            _applicationRepository.Update(application);
            await _unitOfWork.CommitAsync();
        }

        #endregion

        #region DELETE

        /// <summary>
        /// Başvuruyu siler (Soft Delete)
        /// </summary>
        public async Task DeleteAsync(int id)
        {
            var application = await _applicationRepository.GetByIdAsync(id);

            if (application == null)
                throw new InvalidOperationException($"Başvuru ID: {id} bulunamadı.");

            if (application.IsDeleted)
                throw new InvalidOperationException("Bu başvuru zaten silinmiş durumda.");

            _applicationRepository.Remove(application); // Soft Delete
            await _unitOfWork.CommitAsync();
        }

        /// <summary>
        /// Silinen başvuruyu geri yükler
        /// </summary>
        public async Task RestoreAsync(int id)
        {
            var application = await _applicationRepository.GetByIdAsync(id);

            if (application == null)
                throw new InvalidOperationException($"Başvuru ID: {id} bulunamadı.");

            if (!application.IsDeleted)
                throw new InvalidOperationException("Bu başvuru silinmemiş durumda.");

            _applicationRepository.Restore(application);
            await _unitOfWork.CommitAsync();
        }

        #endregion

        #region HELPER METHODS

        /// <summary>
        /// Kullanıcının admin olup olmadığını kontrol eder
        /// </summary>
        private async Task<bool> IsUserAdminAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                return false;

            // TODO: Role tablosuna göre kontrol yapılacak
            // Şimdilik örnek olarak false dönüyoruz
            return false;
        }

        #endregion
    }
}