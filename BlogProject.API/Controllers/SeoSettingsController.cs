using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = RoleNames.AdminOnly)]
    public class SeoSettingsController : ControllerBase
    {
        private readonly IGenericCrudService<SeoSettingDto, SeoSettingDto, SeoSettingDto> _service;

        public SeoSettingsController(IGenericCrudService<SeoSettingDto, SeoSettingDto, SeoSettingDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<SeoSettingDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20) =>
            Ok(await _service.GetPagedAsync(page, pageSize));

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SeoSettingDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<SeoSettingDto>> Create(SeoSettingDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, SeoSettingDto dto) =>
            await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
