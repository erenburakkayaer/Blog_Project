using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // Rol tanımlama en yüksek yetki seviyesi — sadece Super Admin
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = RoleNames.SuperAdmin)]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetAll() =>
            Ok(await _roleService.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<ActionResult<RoleDto>> GetById(int id)
        {
            var role = await _roleService.GetByIdAsync(id);
            return role is null ? NotFound() : Ok(role);
        }

        [HttpPost]
        public async Task<ActionResult<RoleDto>> Create(RoleCreateDto dto)
        {
            try
            {
                var created = await _roleService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _roleService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}
