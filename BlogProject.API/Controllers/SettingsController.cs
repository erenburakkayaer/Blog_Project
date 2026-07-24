using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // Site ayarları sadece admin panelinden yönetilir, herkese açık değildir
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = RoleNames.AdminOnly)]
    public class SettingsController : ControllerBase
    {
        private readonly IGenericCrudService<SettingDto, SettingDto, SettingDto> _service;

        public SettingsController(IGenericCrudService<SettingDto, SettingDto, SettingDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<SettingDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20) =>
            Ok(await _service.GetPagedAsync(page, pageSize));

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SettingDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<SettingDto>> Create(SettingDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, SettingDto dto) =>
            await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
