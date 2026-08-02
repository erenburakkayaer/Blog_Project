namespace Staj_proje.DTO.Role
{
    public class RoleListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Özet veri: Rola bağlı izin/yetki sayısı
        public int PermissionCount { get; set; }
    }
}
