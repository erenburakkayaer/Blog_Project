using Mapster;
using Staj_proje.DTO.Offer;
using Staj_proje.Entities;
using Staj_proje.Interfaces;
using CompanyServiceEntity = Staj_proje.Entities.CompanyService;

namespace Staj_proje.Services
{
    public class OfferService : IOfferService
    {
        private readonly IOfferRepository _offerRepository;
        private readonly IGenericRepository<Company> _companyRepository;
        private readonly IGenericRepository<CompanyServiceEntity> _companyServiceRepository;
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<FileAsset> _fileAssetRepository;
        private readonly IUnitOfWork _unitOfWork;

        public OfferService(
            IOfferRepository offerRepository,
            IGenericRepository<Company> companyRepository,
            IGenericRepository<CompanyServiceEntity> companyServiceRepository,
            IGenericRepository<User> userRepository,
            IGenericRepository<FileAsset> fileAssetRepository,
            IUnitOfWork unitOfWork)
        {
            _offerRepository = offerRepository;
            _companyRepository = companyRepository;
            _companyServiceRepository = companyServiceRepository;
            _userRepository = userRepository;
            _fileAssetRepository = fileAssetRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir teklif talebi oluşturur
        /// </summary>
        public async Task<int> CreateOfferAsync(OfferCreateDto createOfferDto, int requesterUserId)
        {
            if (!await IsCompanyExistsAsync(createOfferDto.CompanyId))
                throw new InvalidOperationException($"Şirket ID: {createOfferDto.CompanyId} bulunamadı.");

            if (!await IsUserExistsAsync(requesterUserId))
                throw new InvalidOperationException($"Kullanıcı ID: {requesterUserId} bulunamadı.");

            if (createOfferDto.CompanyServiceId.HasValue && !await IsCompanyServiceExistsAsync(createOfferDto.CompanyServiceId.Value))
                throw new InvalidOperationException($"Şirket Hizmeti ID: {createOfferDto.CompanyServiceId.Value} bulunamadı.");

            if (createOfferDto.RequirementFileId.HasValue)
            {
                var file = await _fileAssetRepository.GetByIdAsync(createOfferDto.RequirementFileId.Value);
                if (file == null)
                    throw new InvalidOperationException($"Dosya (FileAsset) ID: {createOfferDto.RequirementFileId.Value} bulunamadı.");
            }

            var offer = new Offer
            {
                CompanyId = createOfferDto.CompanyId,
                CompanyServiceId = createOfferDto.CompanyServiceId,
                RequesterUserId = requesterUserId,
                ContactName = createOfferDto.ContactName.Trim(),
                ContactEmail = createOfferDto.ContactEmail.Trim().ToLower(),
                ContactPhone = createOfferDto.ContactPhone.Trim(),
                Title = createOfferDto.Title.Trim(),
                RequirementDetails = createOfferDto.RequirementDetails.Trim(),
                RequirementFileId = createOfferDto.RequirementFileId,
                Status = OfferStatus.Pending,
                Currency = "TL",
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            await _offerRepository.AddAsync(offer);
            await _unitOfWork.CommitAsync();

            return offer.Id;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre teklif detayını getirir
        /// </summary>
        public async Task<OfferDetailDto> GetOfferByIdAsync(int id)
        {
            var offer = await _offerRepository.GetOfferWithDetailsByIdAsync(id);

            if (offer == null)
                throw new InvalidOperationException($"Teklif ID: {id} bulunamadı.");

            return offer.Adapt<OfferDetailDto>();
        }

        /// <summary>
        /// Tüm teklifleri sayfalı olarak listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetAllOffersAsync(int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.FindAsync(o => !o.IsDeleted);
            var pagedOffers = offers.OrderByDescending(o => o.CreatedAt).Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        /// <summary>
        /// Belirli bir şirkete gelen teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetOffersByCompanyAsync(int companyId, int pageNumber = 1, int pageSize = 20)
        {
            if (!await IsCompanyExistsAsync(companyId))
                throw new InvalidOperationException($"Şirket ID: {companyId} bulunamadı.");

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.GetOffersByCompanyIdAsync(companyId);
            var pagedOffers = offers.Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        /// <summary>
        /// Belirli bir kullanıcının teklif taleplerini listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetOffersByUserAsync(int userId, int pageNumber = 1, int pageSize = 20)
        {
            if (!await IsUserExistsAsync(userId))
                throw new InvalidOperationException($"Kullanıcı ID: {userId} bulunamadı.");

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.GetOffersByUserIdAsync(userId);
            var pagedOffers = offers.Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        /// <summary>
        /// Duruma göre teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetOffersByStatusAsync(OfferStatus status, int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.GetOffersByStatusAsync(status);
            var pagedOffers = offers.Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        /// <summary>
        /// Beklemedeki teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetPendingOffersAsync(int pageNumber = 1, int pageSize = 20)
            => await GetOffersByStatusAsync(OfferStatus.Pending, pageNumber, pageSize);

        /// <summary>
        /// Gönderilen teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetSentOffersAsync(int pageNumber = 1, int pageSize = 20)
            => await GetOffersByStatusAsync(OfferStatus.Sent, pageNumber, pageSize);

        /// <summary>
        /// Kabul edilen teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetAcceptedOffersAsync(int pageNumber = 1, int pageSize = 20)
            => await GetOffersByStatusAsync(OfferStatus.Accepted, pageNumber, pageSize);

        /// <summary>
        /// Reddedilen teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetRejectedOffersAsync(int pageNumber = 1, int pageSize = 20)
            => await GetOffersByStatusAsync(OfferStatus.Rejected, pageNumber, pageSize);

        /// <summary>
        /// Süresi dolmuş teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetExpiredOffersAsync(int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.FindAsync(o =>
                !o.IsDeleted &&
                (o.Status == OfferStatus.Expired || (o.ValidUntil != null && o.ValidUntil <= DateTime.UtcNow))
            );
            var pagedOffers = offers.OrderByDescending(o => o.CreatedAt).Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        /// <summary>
        /// Belirli bir şirket hizmetine ait teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetOffersByCompanyServiceAsync(int companyServiceId, int pageNumber = 1, int pageSize = 20)
        {
            if (!await IsCompanyServiceExistsAsync(companyServiceId))
                throw new InvalidOperationException($"Şirket Hizmeti ID: {companyServiceId} bulunamadı.");

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.FindAsync(o => !o.IsDeleted && o.CompanyServiceId == companyServiceId);
            var pagedOffers = offers.OrderByDescending(o => o.CreatedAt).Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        #endregion

        #region UPDATE & STATUS UPDATES

        /// <summary>
        /// Şirket tarafından teklife yanıt verilir ve teklif gönderilir
        /// </summary>
        public async Task<bool> RespondToOfferAsync(int id, OfferCompanyDto companyResponseDto)
        {
            var offer = await _offerRepository.GetByIdAsync(id);

            if (offer == null || offer.IsDeleted)
                throw new InvalidOperationException($"Teklif ID: {id} bulunamadı.");

            if (companyResponseDto.ProposalFileId.HasValue)
            {
                var file = await _fileAssetRepository.GetByIdAsync(companyResponseDto.ProposalFileId.Value);
                if (file == null)
                    throw new InvalidOperationException($"Teklif dosyası (FileAsset) ID: {companyResponseDto.ProposalFileId.Value} bulunamadı.");
            }

            companyResponseDto.Adapt(offer);
            offer.Status = OfferStatus.Sent;
            offer.RespondedAt = DateTime.UtcNow;

            _offerRepository.Update(offer);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Teklif durumunu günceller
        /// </summary>
        public async Task<bool> UpdateOfferStatusAsync(int id, OfferStatusUpdateDto statusUpdateDto)
        {
            var offer = await _offerRepository.GetByIdAsync(id);

            if (offer == null || offer.IsDeleted)
                throw new InvalidOperationException($"Teklif ID: {id} bulunamadı.");

            offer.Status = statusUpdateDto.Status;
            if (statusUpdateDto.Status == OfferStatus.Sent && !offer.RespondedAt.HasValue)
                offer.RespondedAt = DateTime.UtcNow;

            _offerRepository.Update(offer);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Teklifi incelemede durumuna alır
        /// </summary>
        public async Task<bool> MarkAsInReviewAsync(int id)
            => await UpdateOfferStatusAsync(id, new OfferStatusUpdateDto { Status = OfferStatus.InReview });

        /// <summary>
        /// Teklifi gönderildi durumuna alır
        /// </summary>
        public async Task<bool> MarkAsSentAsync(int id)
            => await UpdateOfferStatusAsync(id, new OfferStatusUpdateDto { Status = OfferStatus.Sent });

        /// <summary>
        /// Teklifi kabul edildi durumuna alır
        /// </summary>
        public async Task<bool> MarkAsAcceptedAsync(int id)
            => await UpdateOfferStatusAsync(id, new OfferStatusUpdateDto { Status = OfferStatus.Accepted });

        /// <summary>
        /// Teklifi reddedildi durumuna alır
        /// </summary>
        public async Task<bool> MarkAsRejectedAsync(int id)
            => await UpdateOfferStatusAsync(id, new OfferStatusUpdateDto { Status = OfferStatus.Rejected });

        /// <summary>
        /// Teklifi süresi doldu durumuna alır
        /// </summary>
        public async Task<bool> MarkAsExpiredAsync(int id)
            => await UpdateOfferStatusAsync(id, new OfferStatusUpdateDto { Status = OfferStatus.Expired });

        /// <summary>
        /// Teklifi iptal edildi durumuna alır
        /// </summary>
        public async Task<bool> MarkAsCanceledAsync(int id)
            => await UpdateOfferStatusAsync(id, new OfferStatusUpdateDto { Status = OfferStatus.Canceled });

        #endregion

        #region DELETE

        /// <summary>
        /// Teklifi siler (Soft Delete - IsDeleted = true)
        /// </summary>
        public async Task<bool> DeleteOfferAsync(int id)
        {
            var offer = await _offerRepository.GetByIdAsync(id);

            if (offer == null)
                throw new InvalidOperationException($"Teklif ID: {id} bulunamadı.");

            if (offer.IsDeleted)
                throw new InvalidOperationException("Bu teklif zaten silinmiş durumda.");

            _offerRepository.Remove(offer); // Soft Delete
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen teklifi geri yükler (IsDeleted = false)
        /// </summary>
        public async Task<bool> RestoreOfferAsync(int id)
        {
            var offer = await _offerRepository.GetByIdAsync(id);

            if (offer == null)
                throw new InvalidOperationException($"Teklif ID: {id} bulunamadı.");

            if (!offer.IsDeleted)
                throw new InvalidOperationException("Bu teklif silinmemiş durumda.");

            _offerRepository.Restore(offer);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Teklifi veritabanından kalıcı olarak siler (Hard Delete)
        /// </summary>
        public async Task<bool> PermanentlyDeleteOfferAsync(int id)
        {
            var offer = await _offerRepository.GetByIdAsync(id);

            if (offer == null)
                throw new InvalidOperationException($"Teklif ID: {id} bulunamadı.");

            _offerRepository.HardDelete(offer);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Belirli bir şirkete ait tüm teklifleri siler
        /// </summary>
        public async Task<bool> DeleteOffersByCompanyAsync(int companyId)
        {
            var offers = await _offerRepository.FindAsync(o => o.CompanyId == companyId && !o.IsDeleted);
            foreach (var offer in offers)
            {
                _offerRepository.Remove(offer);
            }
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region SEARCH & FILTER

        /// <summary>
        /// Teklif başlığına göre arama yapar
        /// </summary>
        public async Task<List<OfferListDto>> SearchOffersByTitleAsync(string title, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Başlık arama kelimesi boş olamaz.", nameof(title));

            var trimmedTitle = title.Trim();
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.FindAsync(o => !o.IsDeleted && o.Title.Contains(trimmedTitle));
            var pagedOffers = offers.OrderByDescending(o => o.CreatedAt).Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        /// <summary>
        /// İletişim kişisi adına göre arama yapar
        /// </summary>
        public async Task<List<OfferListDto>> SearchOffersByContactNameAsync(string contactName, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(contactName))
                throw new ArgumentException("İletişim kişisi adı boş olamaz.", nameof(contactName));

            var trimmedName = contactName.Trim();
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.FindAsync(o => !o.IsDeleted && o.ContactName.Contains(trimmedName));
            var pagedOffers = offers.OrderByDescending(o => o.CreatedAt).Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        /// <summary>
        /// Belirli bir tarih aralığında oluşturulan teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetOffersByDateRangeAsync(DateTime startDate, DateTime endDate, int pageNumber = 1, int pageSize = 20)
        {
            if (startDate > endDate)
                throw new ArgumentException("Başlangıç tarihi bitiş tarihinden sonra olamaz.");

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.FindAsync(o =>
                !o.IsDeleted &&
                o.CreatedAt >= startDate &&
                o.CreatedAt <= endDate
            );
            var pagedOffers = offers.OrderByDescending(o => o.CreatedAt).Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        /// <summary>
        /// Geçerlilik tarihi belirli bir tarihten önce olan teklifleri listeler
        /// </summary>
        public async Task<List<OfferListDto>> GetOffersByValidUntilDateAsync(DateTime beforeDate, int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var offers = await _offerRepository.FindAsync(o =>
                !o.IsDeleted &&
                o.ValidUntil.HasValue &&
                o.ValidUntil.Value <= beforeDate
            );
            var pagedOffers = offers.OrderByDescending(o => o.CreatedAt).Skip((page - 1) * size).Take(size).ToList();

            return pagedOffers.Adapt<List<OfferListDto>>();
        }

        #endregion

        #region STATISTICS

        /// <summary>
        /// Toplam silinmemiş teklif sayısını getirir
        /// </summary>
        public async Task<int> GetTotalOfferCountAsync()
        {
            var offers = await _offerRepository.FindAsync(o => !o.IsDeleted);
            return offers.Count;
        }

        /// <summary>
        /// Bekleyen toplam teklif sayısını getirir
        /// </summary>
        public async Task<int> GetPendingOfferCountAsync()
        {
            var offers = await _offerRepository.FindAsync(o => !o.IsDeleted && o.Status == OfferStatus.Pending);
            return offers.Count;
        }

        /// <summary>
        /// Şirkete ait bekleyen teklif sayısını getirir
        /// </summary>
        public async Task<int> GetPendingOfferCountByCompanyAsync(int companyId)
        {
            var offers = await _offerRepository.FindAsync(o => !o.IsDeleted && o.CompanyId == companyId && o.Status == OfferStatus.Pending);
            return offers.Count;
        }

        /// <summary>
        /// Şirkete ait toplam teklif sayısını getirir
        /// </summary>
        public async Task<int> GetOfferCountByCompanyAsync(int companyId)
        {
            var offers = await _offerRepository.FindAsync(o => !o.IsDeleted && o.CompanyId == companyId);
            return offers.Count;
        }

        /// <summary>
        /// Belirli bir durumdaki toplam teklif sayısını getirir
        /// </summary>
        public async Task<int> GetOfferCountByStatusAsync(OfferStatus status)
        {
            var offers = await _offerRepository.FindAsync(o => !o.IsDeleted && o.Status == status);
            return offers.Count;
        }

        /// <summary>
        /// Süresi dolmuş teklif sayısını getirir
        /// </summary>
        public async Task<int> GetExpiredOfferCountAsync()
        {
            var offers = await _offerRepository.FindAsync(o =>
                !o.IsDeleted &&
                (o.Status == OfferStatus.Expired || (o.ValidUntil.HasValue && o.ValidUntil.Value <= DateTime.UtcNow))
            );
            return offers.Count;
        }

        #endregion

        #region VALIDATION & CHECK

        /// <summary>
        /// Teklifin var olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsOfferExistsAsync(int id)
        {
            var offer = await _offerRepository.GetByIdAsync(id);
            return offer != null && !offer.IsDeleted;
        }

        /// <summary>
        /// Şirketin var olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsCompanyExistsAsync(int companyId)
        {
            var company = await _companyRepository.GetByIdAsync(companyId);
            return company != null && !company.IsDeleted;
        }

        /// <summary>
        /// Şirket hizmetinin var olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsCompanyServiceExistsAsync(int companyServiceId)
        {
            var service = await _companyServiceRepository.GetByIdAsync(companyServiceId);
            return service != null && !service.IsDeleted;
        }

        /// <summary>
        /// Kullanıcının var olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsUserExistsAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user != null;
        }

        /// <summary>
        /// Teklifin süresinin dolup dolmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsOfferExpiredAsync(int id)
        {
            var offer = await _offerRepository.GetByIdAsync(id);
            if (offer == null || offer.IsDeleted)
                throw new InvalidOperationException($"Teklif ID: {id} bulunamadı.");

            return offer.Status == OfferStatus.Expired || (offer.ValidUntil.HasValue && offer.ValidUntil.Value <= DateTime.UtcNow);
        }

        #endregion

        #region EMAIL NOTIFICATIONS

        /// <summary>
        /// Şirkete yeni teklif talebi geldiğine dair e-posta bildirimi gönderir
        /// </summary>
        public async Task<bool> SendOfferRequestEmailToCompanyAsync(int offerId)
        {
            var offer = await _offerRepository.GetOfferWithDetailsByIdAsync(offerId);
            if (offer == null)
                throw new InvalidOperationException($"Teklif ID: {offerId} bulunamadı.");

            // E-posta gönderim simülasyonu / altyapı entegrasyonu
            await Task.CompletedTask;
            return true;
        }

        /// <summary>
        /// Teklif talep eden kullanıcıya şirket yanıt verdiğinde e-posta bildirimi gönderir
        /// </summary>
        public async Task<bool> SendOfferResponseEmailToRequesterAsync(int offerId)
        {
            var offer = await _offerRepository.GetOfferWithDetailsByIdAsync(offerId);
            if (offer == null)
                throw new InvalidOperationException($"Teklif ID: {offerId} bulunamadı.");

            // E-posta gönderim simülasyonu / altyapı entegrasyonu
            await Task.CompletedTask;
            return true;
        }

        #endregion

        #region HELPER METHODS

        private static int NormalizePageNumber(int pageNumber) => pageNumber < 1 ? 1 : pageNumber;
        private static int NormalizePageSize(int pageSize) => pageSize < 1 ? 20 : (pageSize > 100 ? 100 : pageSize);

        #endregion
    }
}
