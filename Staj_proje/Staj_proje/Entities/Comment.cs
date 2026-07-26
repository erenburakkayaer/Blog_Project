namespace Staj_proje.Entities
{
    public class Comment
    {
        public int Id { get; set; }

        public int BlogId { get; set; }
        public Blog Blog { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
        //Onaylı mı
        public bool IsApproved { get; set; } = true;
        public string Content { get; set; } = string.Empty;
    }
}
