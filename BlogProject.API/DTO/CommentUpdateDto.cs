namespace BlogProject.API.DTO
{
    // Sadece personel kullanır — yorumu onaylama
    public class CommentUpdateDto
    {
        public bool IsApproved { get; set; }
    }
}
