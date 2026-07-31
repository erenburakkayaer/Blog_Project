namespace Staj_proje.DTO.BlogComment
{
    public class BlogCommentResponseDto
    {
        public int Id { get; set; }
        public int BlogId { get; set; }

        public int UserId { get; set; }
        public string UserFullName { get; set; } = string.Empty; // User.FirstName + " " + User.LastName
        public string? UserProfilePictureUrl { get; set; } // Varsa profil resmi

        public string Content { get; set; } = string.Empty;
        public int? ParentCommentId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Alt yanıtlar için hiyerarşik yapı
        public List<BlogCommentResponseDto> Replies { get; set; } = new();
    }
}
