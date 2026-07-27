namespace Staj_proje.Entities
{
    public class BlogComment
    {
        public int Id { get; set; }

        public int BlogId { get; set; }
        public Blog Blog { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Content { get; set; } = string.Empty;
        public bool IsApproved { get; set; } = true;
        public int? ParentCommentId { get; set; }
        public BlogComment? ParentComment { get; set; }
        public ICollection<BlogComment> Replies { get; set; } = new HashSet<BlogComment>();
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
