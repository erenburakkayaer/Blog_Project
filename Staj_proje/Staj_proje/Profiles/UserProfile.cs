using Mapster;
using Staj_proje.DTO.User;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    public class UserProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // 1. CreateUserDto -> User Dönüşümü[cite: 7, 11]
            config.NewConfig<CreateUserDto, User>()
                .Ignore(dest => dest.Id)                   // Id veritabanı/Identity tarafından atanır[cite: 11]
                .Ignore(dest => dest.PasswordHash)         // DTO'daki Password şifrelenerek UserManager.CreateAsync ile atanmalıdır[cite: 7]
                .Ignore(dest => dest.NormalizedEmail)      // Identity tarafından otomatik yönetilir[cite: 11]
                .Ignore(dest => dest.NormalizedUserName)   // Identity tarafından otomatik yönetilir[cite: 11]
                .Ignore(dest => dest.SecurityStamp)        // Identity güvenlik anahtarı[cite: 11]
                .Ignore(dest => dest.ConcurrencyStamp)     // Identity çakışma kontrolü[cite: 11]
                .Ignore(dest => dest.AvatarFileAsset)      // Navigation property EF Core ilişkisindedir[cite: 11]
                .Ignore(dest => dest.Blogs)                // İlişkili koleksiyonlar ezilmemeli[cite: 11]
                .Ignore(dest => dest.Pages)                // İlişkili koleksiyonlar ezilmemeli[cite: 11]
                .Ignore(dest => dest.Logs)                 // İlişkili koleksiyonlar ezilmemeli[cite: 11]
                .Ignore(dest => dest.RefreshTokens);       // İlişkili koleksiyonlar ezilmemeli[cite: 11]

            // 2. UpdateUserdto -> User Dönüşümü[cite: 9, 11]
            config.NewConfig<UpdateUserdto, User>()
                .Ignore(dest => dest.Id)                   // Kullanıcı Id'si değiştirilemez[cite: 11]
                .Ignore(dest => dest.Email)                // E-posta güncellemesi Identity UserManager üzerinden yapılmalıdır[cite: 5, 11]
                .Ignore(dest => dest.NormalizedEmail)
                .Ignore(dest => dest.NormalizedUserName)
                .Ignore(dest => dest.PasswordHash)
                .Ignore(dest => dest.SecurityStamp)
                .Ignore(dest => dest.ConcurrencyStamp)
                .Ignore(dest => dest.AvatarFileAsset)      // Navigation property[cite: 11]
                .Ignore(dest => dest.Blogs)
                .Ignore(dest => dest.Pages)
                .Ignore(dest => dest.Logs)
                .Ignore(dest => dest.RefreshTokens);

            // 3. User -> UserResponseDto Dönüşümü[cite: 10, 11]
            config.NewConfig<User, UserResponseDto>();
            // Alan isimleri (Id, FirstName, LastName, Email, PhoneNumber, JobTitle, AvatarFileAssetId) 
            // birebir eşleştiği için ek konfigürasyon gerekmez[cite: 10, 11].
        }
    }
}