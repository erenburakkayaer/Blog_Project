using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedResultDto<ProjectDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null) =>
            Ok(await _projectService.GetPagedAsync(page, pageSize, search));

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProjectDto>> GetById(int id)
        {
            var item = await _projectService.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ProjectDto>> Create(ProjectCreateDto dto)
        {
            var created = await _projectService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, ProjectUpdateDto dto) =>
            await _projectService.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id) =>
            await _projectService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
