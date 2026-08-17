using Mapster;
using Staj_proje.DTO.Application;
using Staj_proje.Entities; 

namespace Staj_proje.Profiles
{
    public class ApplicationProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // 1. Entity -> ApplicationResponseDto
            config.NewConfig<Application, ApplicationResponseDto>()
                // Navigation property üzerinden İlan Başlığını eşleme
                .Map(dest => dest.CareerTitle, src =>src.Career.Title)

                // Navigation property üzerinden Başvuran Adı Soyadı eşleme
                .Map(dest => dest.ApplicantName, src => src.User != null ? $"{src.User.FirstName} {src.User.LastName}".Trim() : null)

                // Status bir Enum ise string'e dönüştürür (Değilse doğrudan eşler)
                .Map(dest => dest.Status, src => src.Status.ToString());

            // 3. ApplicationUpdateDto -> Entity (Patch / Update İşlemleri)
            config.NewConfig<ApplicationUpdateDto, Application>()
                // DTO'da null gönderilen alanların var olan Entity verisini ezmesini engeller
                .IgnoreNullValues(true);
        }
    }
}