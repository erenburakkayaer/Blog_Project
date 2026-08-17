using Mapster;
using Staj_proje.DTO.Setting;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// Setting entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Setting genelde tek satırlık (singleton) bir site ayarları kaydıdır,
    /// bu yüzden CreateDto yoktur — sadece okuma (Response) ve güncelleme
    /// (Update) yönü tanımlanır.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class SettingProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // Setting -> SettingResponseDto
            // ------------------------------------------------------------
            // Not: FileAsset'te "Url" yerine "FilePath" var, buna göre türetildi.
            config.NewConfig<Setting, SettingResponseDto>()
                .Map(dest => dest.LogoUrl,
                     src => src.LogoFileAsset != null ? src.LogoFileAsset.FilePath : null)
                .Map(dest => dest.HeaderLogoUrl,
                     src => src.HeaderLogoFileAsset != null ? src.HeaderLogoFileAsset.FilePath : null)
                .Map(dest => dest.FooterLogoUrl,
                     src => src.FooterLogoFileAsset != null ? src.FooterLogoFileAsset.FilePath : null)
                .Map(dest => dest.FaviconUrl,
                     src => src.FaviconFileAsset != null ? src.FaviconFileAsset.FilePath : null);

            // ------------------------------------------------------------
            // SettingUpdateDto -> Setting (tek satırlık ayar kaydını güncelleme)
            // Kullanım: updateDto.Adapt(existingSettingEntity);
            // Ardından servis katmanında: existingSetting.UpdatedAt = DateTime.UtcNow;
            // ------------------------------------------------------------
            config.NewConfig<SettingUpdateDto, Setting>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.LogoFileAsset)
                .Ignore(dest => dest.HeaderLogoFileAsset)
                .Ignore(dest => dest.FooterLogoFileAsset)
                .Ignore(dest => dest.FaviconFileAsset)
                .Ignore(dest => dest.UpdatedAt);
        }
    }
}