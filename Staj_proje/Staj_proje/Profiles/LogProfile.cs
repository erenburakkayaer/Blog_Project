using Mapster;
using Staj_proje.Entities;
// Not: LogDetailDto diğer Log DTO'larından farklı bir namespace'te tanımlanmış
// ("Staj_proje.DTOs.LogDTOs" vs. "Staj_proje.DTO.Log"). İkisi de aşağıda kullanılıyor.
using Staj_proje.DTO.Log;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// Log entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Log kayıtları normalde sistem tarafından (audit/interceptor mekanizması ile)
    /// otomatik oluşturulduğu için Create/Update DTO'su yoktur; sadece okuma
    /// yönünde (entity -> DTO) mapping tanımlanır.
    /// LogFilterDto ise entity'ye map edilmez, sorgu (query) parametresi olarak
    /// repository/service katmanında Where koşulları oluşturmak için kullanılır.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class LogProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // Log -> LogListDto
            // ------------------------------------------------------------
            config.NewConfig<Log, LogListDto>()
                .Map(dest => dest.UserFullName,
                     src => src.User != null ? src.User.FirstName + " " + src.User.LastName : null);

            // ------------------------------------------------------------
            // Log -> LogDetailDto
            // ------------------------------------------------------------
            config.NewConfig<Log, LogDetailDto>()
                .Map(dest => dest.UserFullName,
                     src => src.User != null ? src.User.FirstName + " " + src.User.LastName : null)
                .Map(dest => dest.UserEmail,
                     src => src.User != null ? src.User.Email : null);
        }
    }
}