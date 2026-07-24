using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // Roller gibi en yüksek yetki seviyesi — sadece Super Admin
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = RoleNames.SuperAdmin)]
    public class PermissionsController : ControllerBase
    {
        private readonly IGenericCrudService<PermissionDto, PermissionDto, PermissionDto> _service;

        public PermissionsController(IGenericCrudService<PermissionDto, PermissionDto, PermissionDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<PermissionDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20) =>
            Ok(await _service.GetPagedAsync(page, pageSize));

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PermissionDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<PermissionDto>> Create(PermissionDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, PermissionDto dto) =>
            await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
