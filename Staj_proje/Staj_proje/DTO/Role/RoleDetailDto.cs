namespace Staj_proje.DTO.Role
{
    public class RoleDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Role atanmış olan izinlerin ID listesi (Checkbox seçimi için)
        public List<int> PermissionIds { get; set; } = new();

        // Ekranda gösterilecek izin adları (Örn: ["Company.Create", "Company.Delete"])
        public List<string> PermissionNames { get; set; } = new();
    }
}

