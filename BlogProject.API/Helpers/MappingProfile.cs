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
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));
            CreateMap<BlogCreateDto, Blog>();
            CreateMap<BlogUpdateDto, Blog>();

            CreateMap<User, UserDto>()
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role != null ? src.Role.Name : null));
            CreateMap<UserCreateDto, User>();
            CreateMap<UserUpdateDto, User>();

            CreateMap<Role, RoleDto>();
            CreateMap<RoleCreateDto, Role>();

            // Tek DTO'nun hem giriş hem çıkış için kullanıldığı basit içerik modülleri
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<Page, PageDto>().ReverseMap();
            CreateMap<Slider, SliderDto>().ReverseMap();
            CreateMap<CompanyService, CompanyServiceDto>().ReverseMap();
            CreateMap<Project, ProjectDto>().ReverseMap();
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
            CreateMap<MessageUpdateDto, Message>();

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
