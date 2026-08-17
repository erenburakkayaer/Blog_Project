using Mapster;
using Staj_proje.DTO.Blog;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    public class BlogProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Blog, BlogResponseDto>()

                 .Map(dest => dest.AuthorName, src => src.Author != null ? $"{src.Author.FirstName} {src.Author.LastName}".Trim() : string.Empty)
                 .Map(dest => dest.CoverImageUrl, src => src.CoverImageAsset != null ? src.CoverImageAsset.FilePath : null)
                 .Map(dest => dest.CommentCount, src => src.BlogComments != null ? src.BlogComments.Count : 0)
                 ;
            config.NewConfig<Blog, BlogListDto>()
                // Aynı isme ve veri tipine sahip olan alanlar (Id, Title, IsPublished, CreatedAt) 
                // Mapster tarafından otomatik olarak eşlenir.

                // Author -> AuthorName (Örn: Ad ve Soyad birleşimi)
                .Map(dest => dest.AuthorName, src => src.Author != null
                    ? $"{src.Author.FirstName} {src.Author.LastName}".Trim()
                    : string.Empty)

                // Category -> CategoryName
                .Map(dest => dest.CategoryName, src => src.Category != null
                    ? src.Category.Name
                    : string.Empty)

                // CoverImageAsset -> CoverImageUrl
                .Map(dest => dest.CoverImageUrl, src => src.CoverImageAsset != null
                    ? src.CoverImageAsset.FilePath
                    : null);

            config.NewConfig<BlogUpdateDto, Blog>()
                // DTO'da null gönderilen alanların var olan Entity verisini ezmesini engeller
                .IgnoreNullValues(true);
        }
    }
}
