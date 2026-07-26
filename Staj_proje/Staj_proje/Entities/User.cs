using Microsoft.AspNetCore.Identity;

namespace Staj_proje.Entities
{

    public class User : IdentityUser<int>
    {
        public string? JobTitle { get; set; }


        public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
        public ICollection<Page> Pages { get; set; } = new List<Page>();
        public ICollection<Log> Logs { get; set; } = new List<Log>();
    }
}
