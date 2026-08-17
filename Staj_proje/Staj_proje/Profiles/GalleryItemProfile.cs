using Mapster;
using Staj_proje.DTO.GalleyItem;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// GalleryItem entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class GalleryItemProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // GalleryItem -> GalleryItemResponseDto
            // ------------------------------------------------------------
            config.NewConfig<GalleryItem, GalleryItemResponseDto>()
                .Map(dest => dest.CompanyName, src => src.Company.Name)
                .Map(dest => dest.ImageUrl, src => src.FileAsset.FilePath); // FileAsset'te "Url" yerine "FilePath" var, gerekirse base URL ile birleştirin

            // ------------------------------------------------------------
            // GalleryItemCreateDto -> GalleryItem (yeni kayıt oluşturma)
            // ------------------------------------------------------------
            config.NewConfig<GalleryItemCreateDto, GalleryItem>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.FileAsset)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // GalleryItemUpdateDto -> GalleryItem (mevcut kayıt üzerine güncelleme)
            // Kullanım: updateDto.Adapt(existingGalleryItemEntity);
            // Id, CompanyId, CreatedAt ve navigation property'ler değişmez.
            // ------------------------------------------------------------
            config.NewConfig<GalleryItemUpdateDto, GalleryItem>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.CompanyId)
                .Ignore(dest => dest.Company)
                .Ignore(dest => dest.FileAsset)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);
        }
    }
}
