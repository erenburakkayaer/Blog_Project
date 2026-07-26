using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Serilog;
using BlogProject.API.Authentication;
using BlogProject.API.Data;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;
using BlogProject.API.Middlewares;
using BlogProject.API.Repositories;
using BlogProject.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, config) => config
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day));

// Add services to the container.

const string FrontendCorsPolicy = "FrontendCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:3000", "http://localhost:5173" };

        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));
});

// DB bağlantısı henüz gerçek bir SQL Server'a karşı çalıştırılmadı (migration yok).
// Sadece appsettings.json'daki placeholder connection string ile DI kaydı yapılıyor.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IBlogRepository, BlogRepository>();
builder.Services.AddScoped<IBlogService, BlogService>();
// ProjectRepository, Category Include'lı sorgular için IGenericRepository<Project>'i override eder
builder.Services.AddScoped<IGenericRepository<Project>, ProjectRepository>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

// Özel iş kuralı gerektirmeyen basit CRUD modülleri — GenericCrudService üzerinden
builder.Services.AddScoped<IGenericCrudService<CategoryDto, CategoryDto, CategoryDto>,
    GenericCrudService<Category, CategoryDto, CategoryDto, CategoryDto>>();
builder.Services.AddScoped<IGenericCrudService<PageDto, PageDto, PageDto>,
    GenericCrudService<Page, PageDto, PageDto, PageDto>>();
builder.Services.AddScoped<IGenericCrudService<SliderDto, SliderDto, SliderDto>,
    GenericCrudService<Slider, SliderDto, SliderDto, SliderDto>>();
builder.Services.AddScoped<IGenericCrudService<CompanyServiceDto, CompanyServiceDto, CompanyServiceDto>,
    GenericCrudService<CompanyService, CompanyServiceDto, CompanyServiceDto, CompanyServiceDto>>();
builder.Services.AddScoped<IGenericCrudService<ProjectImageDto, ProjectImageDto, ProjectImageDto>,
    GenericCrudService<ProjectImage, ProjectImageDto, ProjectImageDto, ProjectImageDto>>();
builder.Services.AddScoped<IGenericCrudService<ReferenceDto, ReferenceDto, ReferenceDto>,
    GenericCrudService<Reference, ReferenceDto, ReferenceDto, ReferenceDto>>();
builder.Services.AddScoped<IGenericCrudService<CareerDto, CareerDto, CareerDto>,
    GenericCrudService<Career, CareerDto, CareerDto, CareerDto>>();
builder.Services.AddScoped<IGenericCrudService<GalleryItemDto, GalleryItemDto, GalleryItemDto>,
    GenericCrudService<GalleryItem, GalleryItemDto, GalleryItemDto, GalleryItemDto>>();
builder.Services.AddScoped<IGenericCrudService<SettingDto, SettingDto, SettingDto>,
    GenericCrudService<Setting, SettingDto, SettingDto, SettingDto>>();
builder.Services.AddScoped<IGenericCrudService<SeoSettingDto, SeoSettingDto, SeoSettingDto>,
    GenericCrudService<SeoSetting, SeoSettingDto, SeoSettingDto, SeoSettingDto>>();
builder.Services.AddScoped<IGenericCrudService<PermissionDto, PermissionDto, PermissionDto>,
    GenericCrudService<Permission, PermissionDto, PermissionDto, PermissionDto>>();

// Comment: onaylı-yorum-filtreleme iş kuralı olduğu için özel repository/servisi var
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<ICommentService, CommentService>();

// Ziyaretçi formu olan modüller — Create/Update DTO'ları ayrı (hassas alanları dışarıda tutmak için)
builder.Services.AddScoped<IGenericCrudService<MessageDto, MessageCreateDto, MessageUpdateDto>,
    GenericCrudService<Message, MessageDto, MessageCreateDto, MessageUpdateDto>>();
builder.Services.AddScoped<IGenericCrudService<OfferDto, OfferCreateDto, OfferUpdateDto>,
    GenericCrudService<Offer, OfferDto, OfferCreateDto, OfferUpdateDto>>();
builder.Services.AddScoped<IGenericCrudService<ApplicationDto, ApplicationCreateDto, ApplicationUpdateDto>,
    GenericCrudService<Application, ApplicationDto, ApplicationCreateDto, ApplicationUpdateDto>>();

var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"] ?? string.Empty))
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "Postman/Swagger'da: Bearer {token}"
    });
    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // wwwroot/uploads altındaki dosyalara erişim için

app.UseCors(FrontendCorsPolicy);
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
