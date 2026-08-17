using Mapster;
using Staj_proje.DTO.Reference;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// Reference entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class ReferenceProfile: IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // Reference -> ReferenceResponseDto
            // ------------------------------------------------------------
            config.NewConfig<Reference, ReferenceResponseDto>()
                .Map(dest => dest.LogoUrl, src => src.LogoFileAsset.FilePath); // FileAsset'te "Url" yerine "FilePath" var

            // ------------------------------------------------------------
            // ReferenceCreateDto -> Reference (yeni referans oluşturma)
            // ------------------------------------------------------------
            config.NewConfig<ReferenceCreateDto, Reference>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.LogoFileAsset)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // ReferenceUpdateDto -> Reference (mevcut kayıt üzerine güncelleme)
            // Kullanım: updateDto.Adapt(existingReferenceEntity);
            // ------------------------------------------------------------
            config.NewConfig<ReferenceUpdateDto, Reference>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.LogoFileAsset)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);
        }
    }
}