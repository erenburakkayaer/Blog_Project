using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // Sunum katmanı: HTTP <-> Business (Service) yönlendirmesi dışında iş kuralı içermez
    // Ziyaretçiler yayınlanmış yazıları okuyabilir; ekleme/düzenleme/silme sadece giriş yapmış personelde (Editor/Yazar/Admin)
    [ApiController]
    [Route("api/[controller]")]
    public class BlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogsController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedResultDto<BlogDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null) =>
            Ok(await _blogService.GetPagedAsync(page, pageSize, search));

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<BlogDto>> GetById(int id)
        {
            var blog = await _blogService.GetByIdAsync(id);
            return blog is null ? NotFound() : Ok(blog);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<BlogDto>> Create(BlogCreateDto dto)
        {
            var created = await _blogService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, BlogUpdateDto dto)
        {
            var success = await _blogService.UpdateAsync(id, dto);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _blogService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}
