using Staj_proje.Entities;
using static System.Net.WebRequestMethods;

namespace Staj_proje.DTO.Log
{
    public class LogFilterDto
    {
        //Admin panelinde binlerce log arasından tarih aralığına,
        //kullanıcıya veya yapılan işleme göre arama(Search / Filter) yapmak için Controller'a parametre geçilen DTO'dur
        public int? UserId { get; set; }
        public string? EntityName { get; set; }
        public string? EntityId { get; set; }
        public AuditAction? Action { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        // Sayfalama (Pagination) Parametreleri
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
