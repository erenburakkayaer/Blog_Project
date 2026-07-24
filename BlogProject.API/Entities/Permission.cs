namespace BlogProject.API.Entities
{
    // Rol bazlı yetkiler (ör. "blog.create", "user.manage")
    public class Permission
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
