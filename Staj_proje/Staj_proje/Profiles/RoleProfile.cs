using Mapster;
using Staj_proje.DTO.Role;
using Staj_proje.Entities;

namespace Staj_proje.Profiles
{
    /// <summary>
    /// Role entity ve DTO'ları arasındaki Mapster eşleştirme kuralları.
    /// Role, ASP.NET Core Identity'nin IdentityRole&lt;int&gt; sınıfından türediği
    /// için Id, Name gibi alanlar oradan gelir (Name zaten Identity tarafından
    /// tanımlı, DTO'daki Name direkt buna eşlenir).
    /// Program.cs içinde:
    ///     var mapsterConfig = TypeAdapterConfig.GlobalSettings;
    ///     mapsterConfig.Scan(Assembly.GetExecutingAssembly());
    /// şeklinde otomatik taranır (IRegister implemente ettiği için).
    /// </summary>
    public class RoleProfile : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            // ------------------------------------------------------------
            // Role -> RoleListDto
            // ------------------------------------------------------------
            config.NewConfig<Role, RoleListDto>()
                .Map(dest => dest.PermissionCount, src => src.RolePermissions.Count);

            // ------------------------------------------------------------
            // Role -> RoleDetailDto
            // ------------------------------------------------------------
            config.NewConfig<Role, RoleDetailDto>()
                .Map(dest => dest.PermissionIds,
                     src => src.RolePermissions.Select(rp => rp.PermissionId).ToList())
                .Map(dest => dest.PermissionNames,
                     src => src.RolePermissions.Select(rp => rp.Permission.Name).ToList()); // Permission entity'sindeki gerçek alan adına göre düzenleyin

            // ------------------------------------------------------------
            // RoleCreateDto -> Role (yeni rol oluşturma)
            // ------------------------------------------------------------
            // Not: Identity'nin NormalizedName, ConcurrencyStamp gibi alanları
            // Mapster ile değil, RoleManager<Role> üzerinden (CreateAsync)
            // otomatik yönetilmesi önerilir. Doğrudan DbContext ile
            // kaydediyorsanız NormalizedName'i elle set etmeniz gerekir.
            config.NewConfig<RoleCreateDto, Role>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.RolePermissions)
                .Ignore(dest => dest.NormalizedName)
                .Ignore(dest => dest.ConcurrencyStamp);

            // ------------------------------------------------------------
            // RoleUpdateDto -> Role (mevcut rol üzerine güncelleme)
            // Kullanım: updateDto.Adapt(existingRoleEntity);
            // PermissionIds Mapster ile RolePermission koleksiyonuna
            // otomatik senkronize edilmez (junction entity olduğu için);
            // bu senkronizasyon servis katmanında elle yapılmalıdır. Örn:
            //   var toRemove = existingRole.RolePermissions
            //       .Where(rp => !updateDto.PermissionIds.Contains(rp.PermissionId));
            //   var toAdd = updateDto.PermissionIds
            //       .Where(id => !existingRole.RolePermissions.Any(rp => rp.PermissionId == id))
            //       .Select(id => new RolePermission { RoleId = existingRole.Id, PermissionId = id });
            // ------------------------------------------------------------
            config.NewConfig<RoleUpdateDto, Role>()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.RolePermissions)
                .Ignore(dest => dest.NormalizedName)
                .Ignore(dest => dest.ConcurrencyStamp);
        }
    }
}