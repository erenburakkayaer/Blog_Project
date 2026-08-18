using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;

namespace BlogProject.API.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Blog, BlogDto>()
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author != null ? src.Author.Username : string.Empty))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));
            // AuthorId/CategoryId servis tarafında (BlogService) elle atanıyor — AutoMapper burada karışmasın.
            // dest.Category (navigation) ile dto.Category (string) isim çakışması olduğu için o da yok sayılıyor.
            CreateMap<BlogCreateDto, Blog>()
                .ForMember(dest => dest.AuthorId, opt => opt.Ignore())
                .ForMember(dest => dest.CategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());
            CreateMap<BlogUpdateDto, Blog>()
                .ForMember(dest => dest.CategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            CreateMap<User, UserDto>()
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role != null ? src.Role.Name : null));
            // UserCreateDto/UserUpdateDto artık rol slug<->RoleId çözümlemesi gerektiriyor — UserService'te elle uygulanıyor

            CreateMap<Role, RoleDto>();
            CreateMap<RoleCreateDto, Role>();

            CreateMap<Project, ProjectDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));
            CreateMap<ProjectCreateDto, Project>()
                .ForMember(dest => dest.CategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());
            CreateMap<ProjectUpdateDto, Project>()
                .ForMember(dest => dest.CategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            // Tek DTO'nun hem giriş hem çıkış için kullanıldığı basit içerik modülleri
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<Page, PageDto>().ReverseMap();
            CreateMap<Slider, SliderDto>().ReverseMap();
            CreateMap<CompanyService, CompanyServiceDto>().ReverseMap();
            CreateMap<ProjectImage, ProjectImageDto>().ReverseMap();
            CreateMap<Reference, ReferenceDto>().ReverseMap();
            CreateMap<Career, CareerDto>().ReverseMap();
            CreateMap<GalleryItem, GalleryItemDto>().ReverseMap();
            CreateMap<Setting, SettingDto>().ReverseMap();
            CreateMap<SeoSetting, SeoSettingDto>().ReverseMap();
            CreateMap<Permission, PermissionDto>().ReverseMap();
            CreateMap<Log, LogDto>();

            // Ziyaretçi formu olan modüller — Create DTO'da hassas alanlar (IsApproved/IsRead/Status) yok
            CreateMap<Comment, CommentDto>();
            CreateMap<CommentCreateDto, Comment>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
            CreateMap<CommentUpdateDto, Comment>();

            CreateMap<Message, MessageDto>();
            CreateMap<MessageCreateDto, Message>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
            // MessageUpdateDto artık partial update (nullable alanlar) — MessageService'te elle uygulanıyor, AutoMapper kullanılmıyor

            CreateMap<Offer, OfferDto>();
            CreateMap<OfferCreateDto, Offer>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
            CreateMap<OfferUpdateDto, Offer>();

            CreateMap<Application, ApplicationDto>();
            CreateMap<ApplicationCreateDto, Application>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
            CreateMap<ApplicationUpdateDto, Application>();
        }
    }
}
