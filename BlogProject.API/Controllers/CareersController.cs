using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CareersController : ControllerBase
    {
        private readonly IGenericCrudService<CareerDto, CareerDto, CareerDto> _service;

        public CareersController(IGenericCrudService<CareerDto, CareerDto, CareerDto> service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedResultDto<CareerDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null) =>
            Ok(await _service.GetPagedAsync(page, pageSize, search));

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<CareerDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CareerDto>> Create(CareerDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, CareerDto dto) =>
            await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
