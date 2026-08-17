using Mapster;
using Staj_proje.DTO.Category;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    public class CategoryMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // CategoryCreateDto -> Category
            config.NewConfig<CategoryCreateDto, Category>()
                .Map(dest => dest.IsDeleted, src => false); // Varsayılan silinmedi olarak işaretleme

            // Category -> CategoryListDto
            config.NewConfig<Category, CategoryListDto>();

            // CategoryUpdateDto -> Category
            config.NewConfig<CategoryUpdateDto, Category>();
        }
    }
}