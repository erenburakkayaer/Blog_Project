using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;

namespace Staj_proje.Entities
{
    public class Role : IdentityRole<int>
    {

        public string? Description { get; set; }
    }
}
