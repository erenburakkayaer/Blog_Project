using Mapster;
using Staj_proje.DTO.CompanyService;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// CompanyService entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class CompanyServiceProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // CompanyService -> CompanyServiceListDto
            // ------------------------------------------------------------
            config.NewConfig<CompanyService, CompanyServiceListDto>()
                .Map(dest => dest.CompanyName, src => src.Company.Name)
                .Map(dest => dest.CategoryName, src => src.Category.Name);

            // ------------------------------------------------------------
            // CompanyService -> CompanyServiceDetailDto
            // ------------------------------------------------------------
            config.NewConfig<CompanyService, CompanyServiceDetailDto>()
                .Map(dest => dest.CompanyName, src => src.Company.Name)
                .Map(dest => dest.CategoryName, src => src.Category.Name);

            // ------------------------------------------------------------
            // CompanyServiceCreateDto -> CompanyService (yeni kayıt oluşturma)
            // ------------------------------------------------------------
            config.NewConfig<CompanyServiceCreateDto, CompanyService>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.Category)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // CompanyServiceUpdateDto -> CompanyService (mevcut kayıt üzerine güncelleme)
            // Kullanım: updateDto.Adapt(existingCompanyServiceEntity);
            // Id, CompanyId, CreatedAt ve navigation property'ler mevcut entity'de olduğu gibi kalır.
            // ------------------------------------------------------------
            config.NewConfig<CompanyServiceUpdateDto, CompanyService>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.CompanyId)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.Category)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);
        }
    }
}
