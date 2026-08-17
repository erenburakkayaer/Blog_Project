using Mapster;
using Staj_proje.DTO.BlogComment;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    public class BlogCommentProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<BlogComment, BlogCommentResponseDto>()

                 .Map(dest => dest.UserFullName, src => src.User != null ? $"{src.User.FirstName} {src.User.LastName}".Trim() : string.Empty)
                 .Map(dest => dest.UserProfilePictureUrl, src => src.User.AvatarFileAsset != null ? src.User.AvatarFileAsset.FilePath : null);


            config.NewConfig<BlogCommentUpdateDto, BlogComment>()
                // DTO'da null gönderilen alanların var olan Entity verisini ezmesini engeller
                .IgnoreNullValues(true);
        }
    }
}
