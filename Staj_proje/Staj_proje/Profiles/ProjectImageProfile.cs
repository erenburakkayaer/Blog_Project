using Mapster;
using Staj_proje.DTO.ProjectImage;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// ProjectImage entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class ProjectImageProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // ProjectImage -> ProjectImageResponseDto
            // ------------------------------------------------------------
            config.NewConfig<ProjectImage, ProjectImageResponseDto>()
                .Map(dest => dest.ProjectTitle, src => src.Project.Title) // Project entity'sindeki gerçek alan adına göre düzenleyin
                .Map(dest => dest.ImageUrl, src => src.FileAsset.FilePath); // FileAsset'te "Url" yerine "FilePath" var

            // ------------------------------------------------------------
            // ProjectImageCreateDto -> ProjectImage (yeni kayıt oluşturma)
            // ------------------------------------------------------------
            config.NewConfig<ProjectImageCreateDto, ProjectImage>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.Project)
                .Ignore(dest => dest.FileAsset)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);

            // ------------------------------------------------------------
            // ProjectImageUpdateDto -> ProjectImage (mevcut kayıt üzerine güncelleme)
            // Kullanım: updateDto.Adapt(existingProjectImageEntity);
            // Id, ProjectId, CreatedAt ve navigation property'ler değişmez.
            // ------------------------------------------------------------
            config.NewConfig<ProjectImageUpdateDto, ProjectImage>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.ProjectId)
                .Ignore(dest => dest.Project)
                .Ignore(dest => dest.FileAsset)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.IsDeleted);
        }
    }
}