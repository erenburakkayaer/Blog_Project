using Mapster;
using Staj_proje.DTO.SeoSetting;
using Staj_proje.Entities;

namespace Staj_proje.Mapping
{
    /// <summary>
    /// SeoSetting entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class SeoSettingProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // SeoSetting -> SeoSettingResponseDto
            // ------------------------------------------------------------
            config.NewConfig<SeoSetting, SeoSettingResponseDto>()
                .Map(dest => dest.OgImageUrl,
                     src => src.OgImageAsset != null ? src.OgImageAsset.FilePath : null); // FileAsset'te "Url" yerine "FilePath" var

            // ------------------------------------------------------------
            // SeoSettingCreateDto -> SeoSetting (yeni kayıt oluşturma)
            // ------------------------------------------------------------
            config.NewConfig<SeoSettingCreateDto, SeoSetting>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.OgImageAsset)
                .Ignore(dest => dest.UpdatedAt);

            // ------------------------------------------------------------
            // SeoSettingUpdateDto -> SeoSetting (mevcut kayıt üzerine güncelleme)
            // Kullanım: updateDto.Adapt(existingSeoSettingEntity);
            // Ardından servis katmanında: existingSeoSetting.UpdatedAt = DateTime.UtcNow;
            // ------------------------------------------------------------
            config.NewConfig<SeoSettingUpdateDto, SeoSetting>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.OgImageAsset)
                .Ignore(dest => dest.UpdatedAt);
        }
    }
}