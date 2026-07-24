using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // Teklif Al formu — ziyaretçi gönderebilir (POST anonim); okuma/durum güncelleme personelde
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OffersController : ControllerBase
    {
        private readonly IGenericCrudService<OfferDto, OfferCreateDto, OfferUpdateDto> _service;

        public OffersController(IGenericCrudService<OfferDto, OfferCreateDto, OfferUpdateDto> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<OfferDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null) =>
            Ok(await _service.GetPagedAsync(page, pageSize, search));

        [HttpGet("{id:int}")]
        public async Task<ActionResult<OfferDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<OfferDto>> Create(OfferCreateDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, OfferUpdateDto dto) =>
            await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
