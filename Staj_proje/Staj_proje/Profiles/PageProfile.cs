using Mapster;
using Staj_proje.DTO.Page;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// Page entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class PageProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // Page -> PageListDto
            // ------------------------------------------------------------
            config.NewConfig<Page, PageListDto>()
                .Map(dest => dest.BannerImageUrl,
                     src => src.BannerImageAsset != null ? src.BannerImageAsset.FilePath : null);

            // ------------------------------------------------------------
            // Page -> PageDetailDto
            // ------------------------------------------------------------
            config.NewConfig<Page, PageDetailDto>()
                .Map(dest => dest.BannerImageUrl,
                     src => src.BannerImageAsset != null ? src.BannerImageAsset.FilePath : null);

            // ------------------------------------------------------------
            // PageCreateDto -> Page (yeni sayfa oluşturma)
            // ------------------------------------------------------------
            // Not: Slug boş bırakılabilir (DTO'da nullable), backend'in
            // Title'dan otomatik üretmesi bekleniyor. Bu üretim mantığı
            // Mapster'da değil, servis katmanında yapılmalıdır. Örn:
            //   var entity = createDto.Adapt<Page>();
            //   if (string.IsNullOrWhiteSpace(entity.Slug))
            //       entity.Slug = SlugHelper.GenerateFrom(entity.Title);
            config.NewConfig<PageCreateDto, Page>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.SeoSetting)
                .Ignore(dest => dest.BannerImageAsset)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.UpdatedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // PageUpdateDto -> Page (mevcut sayfa üzerine güncelleme)
            // Kullanım: updateDto.Adapt(existingPageEntity);
            // Ardından servis katmanında: existingPage.UpdatedAt = DateTime.UtcNow;
            // ------------------------------------------------------------
            config.NewConfig<PageUpdateDto, Page>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.SeoSetting)
                .Ignore(dest => dest.BannerImageAsset)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.UpdatedAt)
                .Ignore(dest => dest.IsDeleted);
        }
    }
}