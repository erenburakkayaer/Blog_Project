using System.ComponentModel.DataAnnotations;

namespace Staj_proje.Entities
{
    public class Permission
    {
        // Primary Key
        public int Id { get; set; }

        // Yetkinin sistem tarafındaki benzersiz kodu/anahtarı (Örn: "Applications.Read", "Blogs.Create")
        public string Name { get; set; } = string.Empty;

        // Admin panelinde görünecek okunabilir adı (Örn: "Başvuruları Görüntüleme")
        public string DisplayName { get; set; }=string.Empty;
        // Yetkinin açıklaması (Opsiyonel)
        public string Description { get; set; } = string.Empty;
        // Örn: "Blogs", "Applications", "Services"
        public string Group { get; set; } = string.Empty;

        // Role ile Çoka-Çok (Many-to-Many) ilişki için köprü tablosu bağlantısı
        public  ICollection<RolePermission> RolePermissions { get; set; }=new HashSet<RolePermission>();
    }
}
