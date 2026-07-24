using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // Doküman "Services" (Hizmetler) modülüne karşılık gelir
    [ApiController]
    [Route("api/services")]
    public class CompanyServicesController : ControllerBase
    {
        private readonly IGenericCrudService<CompanyServiceDto, CompanyServiceDto, CompanyServiceDto> _service;

        public CompanyServicesController(IGenericCrudService<CompanyServiceDto, CompanyServiceDto, CompanyServiceDto> service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedResultDto<CompanyServiceDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20) =>
            Ok(await _service.GetPagedAsync(page, pageSize));

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<CompanyServiceDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CompanyServiceDto>> Create(CompanyServiceDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, CompanyServiceDto dto) =>
            await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
