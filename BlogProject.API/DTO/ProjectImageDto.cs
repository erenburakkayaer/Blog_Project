namespace BlogProject.API.DTO
{
    public class ProjectImageDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }
}
