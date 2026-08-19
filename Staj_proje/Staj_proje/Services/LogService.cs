using System.Text;
using Mapster;
using Staj_proje.DTO.Log;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    /// <summary>
    /// Audit log işlemlerini yöneten servis sınıfı.
    /// ILogService arayüzünün tüm üyelerini implemente eder.
    /// </summary>
    public class LogService : ILogService
    {
        private readonly IGenericRepository<Log> _logRepository;
        private readonly IGenericRepository<User> _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public LogService(
            IGenericRepository<Log> logRepository,
            IGenericRepository<User> userRepository,
            IUnitOfWork unitOfWork)
        {
            _logRepository = logRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Sistem audit log kaydı oluşturur.
        /// </summary>
        public async Task LogActionAsync(
            int? userId,
            string entityName,
            string entityId,
            AuditAction action,
            string? oldValues,
            string? newValues,
            string ipAddress,
            string userAgent,
            string? httpMethod = null,
            int? statusCode = null)
        {
            if (string.IsNullOrWhiteSpace(entityName))
                throw new ArgumentException("Entity adı zorunludur.", nameof(entityName));

            if (string.IsNullOrWhiteSpace(entityId))
                throw new ArgumentException("Entity ID zorunludur.", nameof(entityId));

            if (string.IsNullOrWhiteSpace(ipAddress))
                throw new ArgumentException("IP adresi zorunludur.", nameof(ipAddress));

            if (string.IsNullOrWhiteSpace(userAgent))
                throw new ArgumentException("User-Agent bilgisi zorunludur.", nameof(userAgent));

            if (userId.HasValue)
            {
                var user = await _userRepository.GetByIdAsync(userId.Value);
                if (user == null)
                    throw new InvalidOperationException($"Kullanıcı ID: {userId} bulunamadı.");
            }

            var log = new Log
            {
                UserId = userId,
                EntityName = entityName.Trim(),
                EntityId = entityId.Trim(),
                Action = action,
                OldValues = oldValues,
                NewValues = newValues,
                IpAddress = ipAddress.Trim(),
                UserAgent = userAgent.Trim(),
                HttpMethod = httpMethod?.Trim(),
                StatusCode = statusCode,
                CreatedAt = DateTime.UtcNow
            };

            await _logRepository.AddAsync(log);
            await _unitOfWork.CommitAsync();
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre log detayını getirir.
        /// </summary>
        public async Task<LogDetailDto> GetLogByIdAsync(long id)
        {
            var log = await GetLogEntityByIdAsync(id);

            if (log == null)
                throw new InvalidOperationException($"Log ID: {id} bulunamadı.");

            return await MapToDetailDtoAsync(log);
        }

        /// <summary>
        /// Tüm logları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<LogListDto>> GetAllLogsAsync(int pageNumber = 1, int pageSize = 20)
        {
            var logs = await _logRepository.GetAllAsync();
            return await GetPagedListDtosAsync(logs, pageNumber, pageSize);
        }

        /// <summary>
        /// Belirli bir kullanıcıya ait logları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<LogListDto>> GetLogsByUserAsync(int userId, int pageNumber = 1, int pageSize = 20)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException($"Kullanıcı ID: {userId} bulunamadı.");

            var logs = await _logRepository.FindAsync(l => l.UserId == userId);
            return await GetPagedListDtosAsync(logs, pageNumber, pageSize);
        }

        /// <summary>
        /// Entity adına göre logları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<LogListDto>> GetLogsByEntityAsync(string entityName, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(entityName))
                throw new ArgumentException("Entity adı boş olamaz.", nameof(entityName));

            var trimmedEntityName = entityName.Trim();
            var logs = await _logRepository.FindAsync(l => l.EntityName == trimmedEntityName);
            return await GetPagedListDtosAsync(logs, pageNumber, pageSize);
        }

        /// <summary>
        /// Entity ID'ye göre logları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<LogListDto>> GetLogsByEntityIdAsync(string entityId, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(entityId))
                throw new ArgumentException("Entity ID boş olamaz.", nameof(entityId));

            var trimmedEntityId = entityId.Trim();
            var logs = await _logRepository.FindAsync(l => l.EntityId == trimmedEntityId);
            return await GetPagedListDtosAsync(logs, pageNumber, pageSize);
        }

        /// <summary>
        /// İşlem türüne göre logları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<LogListDto>> GetLogsByActionAsync(AuditAction action, int pageNumber = 1, int pageSize = 20)
        {
            var logs = await _logRepository.FindAsync(l => l.Action == action);
            return await GetPagedListDtosAsync(logs, pageNumber, pageSize);
        }

        /// <summary>
        /// Tarih aralığına göre logları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<LogListDto>> GetLogsByDateRangeAsync(
            DateTime startDate,
            DateTime endDate,
            int pageNumber = 1,
            int pageSize = 20)
        {
            ValidateDateRange(startDate, endDate);

            var logs = await _logRepository.FindAsync(l => l.CreatedAt >= startDate && l.CreatedAt <= endDate);
            return await GetPagedListDtosAsync(logs, pageNumber, pageSize);
        }

        #endregion

        #region FILTER & SEARCH

        /// <summary>
        /// LogFilterDto parametrelerine göre logları filtreler ve sayfalı olarak döndürür.
        /// </summary>
        public async Task<List<LogListDto>> FilterLogsAsync(LogFilterDto filterDto)
        {
            if (filterDto == null)
                throw new ArgumentNullException(nameof(filterDto));

            if (filterDto.StartDate.HasValue && filterDto.EndDate.HasValue)
                ValidateDateRange(filterDto.StartDate.Value, filterDto.EndDate.Value);

            var logs = await _logRepository.GetAllAsync();
            var filtered = ApplyFilter(logs, filterDto);

            return await GetPagedListDtosAsync(filtered, filterDto.PageNumber, filterDto.PageSize);
        }

        /// <summary>
        /// IP adresine göre log araması yapar.
        /// </summary>
        public async Task<List<LogListDto>> SearchLogsByIpAddressAsync(
            string ipAddress,
            int pageNumber = 1,
            int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(ipAddress))
                throw new ArgumentException("IP adresi boş olamaz.", nameof(ipAddress));

            var trimmedIp = ipAddress.Trim();
            var logs = await _logRepository.FindAsync(l => l.IpAddress.Contains(trimmedIp));
            return await GetPagedListDtosAsync(logs, pageNumber, pageSize);
        }

        /// <summary>
        /// Giriş (Login) işlemlerine ait logları listeler.
        /// </summary>
        public async Task<List<LogListDto>> GetLoginLogsAsync(int pageNumber = 1, int pageSize = 20)
            => await GetLogsByActionAsync(AuditAction.Login, pageNumber, pageSize);

        /// <summary>
        /// Çıkış (Logout) işlemlerine ait logları listeler.
        /// </summary>
        public async Task<List<LogListDto>> GetLogoutLogsAsync(int pageNumber = 1, int pageSize = 20)
            => await GetLogsByActionAsync(AuditAction.Logout, pageNumber, pageSize);

        #endregion

        #region STATISTICS

        /// <summary>
        /// Toplam log sayısını döndürür.
        /// </summary>
        public async Task<int> GetTotalLogCountAsync()
        {
            var logs = await _logRepository.GetAllAsync();
            return logs.Count;
        }

        /// <summary>
        /// Belirli bir kullanıcıya ait log sayısını döndürür.
        /// </summary>
        public async Task<int> GetLogCountByUserAsync(int userId)
        {
            var logs = await _logRepository.FindAsync(l => l.UserId == userId);
            return logs.Count;
        }

        /// <summary>
        /// Belirli bir entity adına ait log sayısını döndürür.
        /// </summary>
        public async Task<int> GetLogCountByEntityAsync(string entityName)
        {
            if (string.IsNullOrWhiteSpace(entityName))
                return 0;

            var trimmedEntityName = entityName.Trim();
            var logs = await _logRepository.FindAsync(l => l.EntityName == trimmedEntityName);
            return logs.Count;
        }

        /// <summary>
        /// Belirli bir işlem türüne ait log sayısını döndürür.
        /// </summary>
        public async Task<int> GetLogCountByActionAsync(AuditAction action)
        {
            var logs = await _logRepository.FindAsync(l => l.Action == action);
            return logs.Count;
        }

        /// <summary>
        /// Belirli bir tarih aralığındaki log sayısını döndürür.
        /// </summary>
        public async Task<int> GetLogCountByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            ValidateDateRange(startDate, endDate);

            var logs = await _logRepository.FindAsync(l => l.CreatedAt >= startDate && l.CreatedAt <= endDate);
            return logs.Count;
        }

        #endregion

        #region DELETE

        /// <summary>
        /// Belirli bir log kaydını kalıcı olarak siler.
        /// </summary>
        public async Task<bool> DeleteLogAsync(long id)
        {
            var log = await GetLogEntityByIdAsync(id);

            if (log == null)
                throw new InvalidOperationException($"Log ID: {id} bulunamadı.");

            _logRepository.Remove(log);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Belirli bir kullanıcıya ait tüm log kayıtlarını siler.
        /// </summary>
        public async Task<bool> DeleteLogsByUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException($"Kullanıcı ID: {userId} bulunamadı.");

            var logs = await _logRepository.FindAsync(l => l.UserId == userId);

            foreach (var log in logs)
                _logRepository.Remove(log);

            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Belirli bir tarih aralığındaki log kayıtlarını siler.
        /// </summary>
        public async Task<bool> DeleteLogsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            ValidateDateRange(startDate, endDate);

            var logs = await _logRepository.FindAsync(l => l.CreatedAt >= startDate && l.CreatedAt <= endDate);

            foreach (var log in logs)
                _logRepository.Remove(log);

            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Tüm log kayıtlarını siler (Admin operasyonu).
        /// </summary>
        public async Task<bool> DeleteAllLogsAsync()
        {
            var logs = await _logRepository.GetAllAsync();

            foreach (var log in logs)
                _logRepository.Remove(log);

            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region EXPORT

        /// <summary>
        /// Filtrelenmiş log kayıtlarını CSV formatında dışa aktarır.
        /// </summary>
        public async Task<byte[]> ExportLogsAsync(LogFilterDto filterDto)
        {
            if (filterDto == null)
                throw new ArgumentNullException(nameof(filterDto));

            if (filterDto.StartDate.HasValue && filterDto.EndDate.HasValue)
                ValidateDateRange(filterDto.StartDate.Value, filterDto.EndDate.Value);

            var logs = await _logRepository.GetAllAsync();
            var filtered = ApplyFilter(logs, filterDto)
                .OrderByDescending(l => l.CreatedAt)
                .ToList();

            var listDtos = await MapToListDtosAsync(filtered);

            var csv = new StringBuilder();
            csv.AppendLine("Id,UserId,UserFullName,EntityName,EntityId,Action,IpAddress,HttpMethod,StatusCode,CreatedAt");

            foreach (var item in listDtos)
            {
                csv.AppendLine(string.Join(",",
                    item.Id,
                    item.UserId?.ToString() ?? string.Empty,
                    EscapeCsvField(item.UserFullName),
                    EscapeCsvField(item.EntityName),
                    EscapeCsvField(item.EntityId),
                    item.Action,
                    EscapeCsvField(item.IpAddress),
                    EscapeCsvField(item.HttpMethod),
                    item.StatusCode?.ToString() ?? string.Empty,
                    item.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")));
            }

            return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray();
        }

        #endregion

        #region PRIVATE HELPERS

        /// <summary>
        /// long tipindeki log ID'si ile kayıt getirir (GenericRepository int desteklediği için FindAsync kullanılır).
        /// </summary>
        private async Task<Log?> GetLogEntityByIdAsync(long id)
        {
            var logs = await _logRepository.FindAsync(l => l.Id == id);
            return logs.FirstOrDefault();
        }

        /// <summary>
        /// Log listesini sayfalar ve LogListDto'ya dönüştürür.
        /// </summary>
        private async Task<List<LogListDto>> GetPagedListDtosAsync(
            List<Log> logs,
            int pageNumber,
            int pageSize)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var pagedLogs = logs
                .OrderByDescending(l => l.CreatedAt)
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();

            return await MapToListDtosAsync(pagedLogs);
        }

        /// <summary>
        /// LogFilterDto koşullarını uygular.
        /// </summary>
        private static IEnumerable<Log> ApplyFilter(IEnumerable<Log> logs, LogFilterDto filterDto)
        {
            var query = logs;

            if (filterDto.UserId.HasValue)
                query = query.Where(l => l.UserId == filterDto.UserId);

            if (!string.IsNullOrWhiteSpace(filterDto.EntityName))
            {
                var entityName = filterDto.EntityName.Trim();
                query = query.Where(l => l.EntityName.Contains(entityName, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(filterDto.EntityId))
            {
                var entityId = filterDto.EntityId.Trim();
                query = query.Where(l => l.EntityId == entityId);
            }

            if (filterDto.Action.HasValue)
                query = query.Where(l => l.Action == filterDto.Action);

            if (filterDto.StartDate.HasValue)
                query = query.Where(l => l.CreatedAt >= filterDto.StartDate.Value);

            if (filterDto.EndDate.HasValue)
                query = query.Where(l => l.CreatedAt <= filterDto.EndDate.Value);

            return query;
        }

        /// <summary>
        /// Tek bir Log entity'sini User bilgisiyle birlikte LogDetailDto'ya dönüştürür.
        /// </summary>
        private async Task<LogDetailDto> MapToDetailDtoAsync(Log log)
        {
            if (log.UserId.HasValue)
            {
                var user = await _userRepository.GetByIdAsync(log.UserId.Value);
                if (user != null)
                    log.User = user;
            }

            return log.Adapt<LogDetailDto>();
        }

        /// <summary>
        /// Log listesini toplu olarak User bilgisiyle LogListDto listesine dönüştürür.
        /// </summary>
        private async Task<List<LogListDto>> MapToListDtosAsync(List<Log> logs)
        {
            if (logs.Count == 0)
                return new List<LogListDto>();

            var userIds = logs
                .Where(l => l.UserId.HasValue)
                .Select(l => l.UserId!.Value)
                .Distinct()
                .ToList();

            var users = userIds.Count > 0
                ? (await _userRepository.FindAsync(u => userIds.Contains(u.Id))).ToDictionary(u => u.Id)
                : new Dictionary<int, User>();

            return logs.Select(log =>
            {
                if (log.UserId.HasValue && users.TryGetValue(log.UserId.Value, out var user))
                    log.User = user;

                return log.Adapt<LogListDto>();
            }).ToList();
        }

        /// <summary>
        /// Tarih aralığı geçerliliğini kontrol eder.
        /// </summary>
        private static void ValidateDateRange(DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
                throw new ArgumentException("Başlangıç tarihi bitiş tarihinden büyük olamaz.");
        }

        /// <summary>
        /// CSV alanındaki özel karakterleri escape eder.
        /// </summary>
        private static string EscapeCsvField(string? value)
        {
            if (string.IsNullOrEmpty(value))
                return string.Empty;

            if (value.Contains('"') || value.Contains(',') || value.Contains('\n') || value.Contains('\r'))
                return $"\"{value.Replace("\"", "\"\"")}\"";

            return value;
        }

        /// <summary>
        /// Sayfa numarasını normalize eder (en az 1).
        /// </summary>
        private static int NormalizePageNumber(int pageNumber) => pageNumber < 1 ? 1 : pageNumber;

        /// <summary>
        /// Sayfa boyutunu normalize eder (1-100 arası).
        /// </summary>
        private static int NormalizePageSize(int pageSize) => pageSize < 1 ? 20 : (pageSize > 100 ? 100 : pageSize);

        #endregion
    }
}
