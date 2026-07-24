using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // Kariyer başvurusu — ziyaretçi gönderebilir (POST anonim); okuma/inceleme personelde
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly IGenericCrudService<ApplicationDto, ApplicationCreateDto, ApplicationUpdateDto> _service;

        public ApplicationsController(IGenericCrudService<ApplicationDto, ApplicationCreateDto, ApplicationUpdateDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<ApplicationDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20) =>
            Ok(await _service.GetPagedAsync(page, pageSize));

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApplicationDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<ApplicationDto>> Create(ApplicationCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, ApplicationUpdateDto dto) =>
            await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
