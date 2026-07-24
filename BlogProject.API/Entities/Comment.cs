namespace BlogProject.API.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public int BlogId { get; set; }
        public Blog? Blog { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;

        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
