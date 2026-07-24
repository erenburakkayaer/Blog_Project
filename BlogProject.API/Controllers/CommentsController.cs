using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // Ziyaretçi yorum ekleyebilir (POST anonim) ve yayınlanmış blog'un onaylı
    // yorumlarını okuyabilir (GET blog/{blogId} anonim); listeleme/onaylama personelde
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<CommentDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null) =>
            Ok(await _commentService.GetPagedAsync(page, pageSize, search));

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CommentDto>> GetById(int id)
        {
            var item = await _commentService.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        // Blog detay sayfasında gösterilecek onaylı yorumlar — herkese açık
        [HttpGet("blog/{blogId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetApprovedByBlog(int blogId) =>
            Ok(await _commentService.GetApprovedByBlogIdAsync(blogId));

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<CommentDto>> Create(CommentCreateDto dto)
        {
            var created = await _commentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CommentUpdateDto dto) =>
            await _commentService.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id) =>
            await _commentService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
