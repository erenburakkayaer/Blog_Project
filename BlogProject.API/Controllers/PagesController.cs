using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagesController : ControllerBase
    {
        private readonly IGenericCrudService<PageDto, PageDto, PageDto> _service;

        public PagesController(IGenericCrudService<PageDto, PageDto, PageDto> service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedResultDto<PageDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null) =>
            Ok(await _service.GetPagedAsync(page, pageSize, search));

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<PageDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PageDto>> Create(PageDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, PageDto dto) =>
            await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
