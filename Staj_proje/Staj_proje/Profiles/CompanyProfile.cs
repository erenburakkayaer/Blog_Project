using Mapster;
using Staj_proje.DTO.Company;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// Company entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class CompanyProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // Company -> CompanyListDto
            // ------------------------------------------------------------
            config.NewConfig<Company, CompanyListDto>()
                .Map(dest => dest.LogoUrl, src => src.LogoFileAsset != null ? src.LogoFileAsset.FilePath : null)
                .Map(dest => dest.ActiveCareersCount,
                     src => src.Careers.Count(c => c.IsActive));

            // ------------------------------------------------------------
            // Company -> CompanyDetailDto
            // ------------------------------------------------------------
            config.NewConfig<Company, CompanyDetailDto>()
                .Map(dest => dest.LogoUrl, src => src.LogoFileAsset != null ? src.LogoFileAsset.FilePath : null)
                .Map(dest => dest.EmployeeCount, src => src.Employees.Count)
                .Map(dest => dest.ActiveCareersCount,
                     src => src.Careers.Count(c => c.IsActive))
                .Map(dest => dest.ServicesCount, src => src.Services.Count)
                .Map(dest => dest.GalleryImageUrls,
                     src => src.GalleryItems.Select(g => g.FileAsset.FilePath).ToList());

            // ------------------------------------------------------------
            // CompanyCreateDto -> Company (yeni kayıt oluşturma)
            // ------------------------------------------------------------
            config.NewConfig<CompanyCreateDto, Company>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.LogoFileAsset)
                .Ignore(dest => dest.GalleryItems)
                .Ignore(dest => dest.Employees)
                .Ignore(dest => dest.Careers)
                .Ignore(dest => dest.Services)
                .Ignore(dest => dest.ContactMessages)
                .Ignore(dest => dest.ServiceOffers);

            // ------------------------------------------------------------
            // CompanyUpdateDto -> Company (mevcut kayıt üzerine güncelleme)
            // Kullanım: updateDto.Adapt(existingCompanyEntity);
            // Id ve navigation collection'lar mevcut entity'de olduğu gibi kalır.
            // ------------------------------------------------------------
            config.NewConfig<CompanyUpdateDto, Company>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.LogoFileAsset)
                .Ignore(dest => dest.GalleryItems)
                .Ignore(dest => dest.Employees)
                .Ignore(dest => dest.Careers)
                .Ignore(dest => dest.Services)
                .Ignore(dest => dest.ContactMessages)
                .Ignore(dest => dest.ServiceOffers);
        }
    }
}
