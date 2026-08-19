using Mapster;
using Staj_proje.DTOs;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    public class ProjectProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // Project -> ProjectDto
            config.NewConfig<Project, ProjectDto>()
                .Map(dest => dest.CategoryName, src => src.Category.Name)
                .Map(dest => dest.CoverImageUrl, src => src.CoverImageUrl.FilePath)
                .Map(dest => dest.ProjectImages, src => src.ProjectImages);

            // ProjectImage -> ProjectImageDto
            config.NewConfig<ProjectImage, ProjectImageDto>()
                .Map(dest => dest.ImageUrl, src => src.FileAsset.FilePath);

            // CreateProjectDto -> Project
            config.NewConfig<CreateProjectDto, Project>()
                .Map(dest => dest.CoverImageUrl, src => (FileAsset)null!)
                .Map(dest => dest.ProjectImages, src => new HashSet<ProjectImage>())
                .Map(dest => dest.IsActive, src => true)
                .Map(dest => dest.IsDeleted, src => false)
                .Map(dest => dest.CreatedAt, src => DateTime.UtcNow);

            // UpdateProjectDto -> Project
            config.NewConfig<UpdateProjectDto, Project>()
                .IgnoreNullValues(true);
        }
    }
}