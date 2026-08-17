using Mapster;
using Staj_proje.DTO.Career;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    public class CareerProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {

            config.NewConfig<Career, CareerListDto>()

                .Map(dest => dest.CompanyName, src => src.Company.Name != null ? src.Company.Name : string.Empty)

                .Map(dest => dest.CompanyLogoUrl, src => src.Company.LogoFileAsset != null ? src.Company.LogoFileAsset.FilePath : string.Empty)

                .Map(dest => dest.CategoryName, src => src.Category.Name);


            config.NewConfig<Career, CareerDetailDto>()

                  .Map(dest => dest.CompanyName, src => src.Company.Name != null ? src.Company.Name : string.Empty)
                  .Map(dest => dest.CompanyLogoUrl, src => src.Company.LogoFileAsset != null ? src.Company.LogoFileAsset.FilePath : string.Empty)
                  .Map(dest => dest.CategoryName, src => src.Category.Name)
                  .Map(dest => dest.ApplicationCount, src => src.Applications != null ? src.Applications.Count : 0);

           config.NewConfig<CareerCreateDto, Career>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.IsDeleted)
                .Map(dest => dest.IsActive, src => true) // Yeni oluşturulan ilan varsayılan aktif olsun
                .Map(dest => dest.CreatedAt, src => DateTime.UtcNow);

            // 4. CareerUpdateDto -> Career Eşlemesi (Var olan entity üzerine ezme)
            config.NewConfig<CareerUpdateDto, Career>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.CompanyId) // İlanın firması güncellenemez
                .Ignore(dest => dest.CreatedAt)  // Oluşturulma tarihi korunsun
                .Ignore(dest => dest.IsDeleted)
                .IgnoreNullValues(true); ;

            // 5. CareerStatusUpdateDto -> Career Eşlemesi (Sadece IsActive durum güncellemesi)
            config.NewConfig<CareerStatusUpdateDto, Career>()
                .IgnoreNonMapped(true) // DTO içindeki hariç hiçbir alanı değiştirme
                .Map(dest => dest.IsActive, src => src.IsActive);
        }
    }
}
