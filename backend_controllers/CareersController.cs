using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.DTO.Career;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CareersController : ControllerBase
    {
        private readonly ICareerService _careerService;

        public CareersController(ICareerService careerService)
        {
            _careerService = careerService;
        }

        /// <summary>
        /// Tüm Aktif İş ve Staj İlanlarını Listeler (Ziyaretçiye Açık)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetActiveCareers()
        {
            var careers = await _careerService.GetActiveCareersAsync();
            return Ok(careers);
        }

        /// <summary>
        /// Tüm İlanları Listeler (Yönetici & İnsan Kaynakları)
        /// </summary>
        [HttpGet("all")]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> GetAllCareers()
        {
            var careers = await _careerService.GetAllCareersAsync();
            return Ok(careers);
        }

        /// <summary>
        /// ID'ye Göre İlan Detayını Getirir
        /// </summary>
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var career = await _careerService.GetCareerByIdAsync(id);
            if (career == null)
                return NotFound(new { message = "İlan bulunamadı." });

            return Ok(career);
        }

        /// <summary>
        /// Yeni İş/Staj İlanı Oluşturur (Şirket Yöneticisi & İK)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> Create([FromBody] CareerCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newId = await _careerService.CreateCareerAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = newId }, new { id = newId, message = "İş ilanı başarıyla yayınlandı." });
        }

        /// <summary>
        /// İlanı Günceller
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> Update(int id, [FromBody] CareerUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _careerService.UpdateCareerAsync(id, updateDto);
            if (!result)
                return NotFound(new { message = "İlan bulunamadı veya güncellenemedi." });

            return Ok(new { message = "İlan başarıyla güncellendi." });
        }

        /// <summary>
        /// İlanı Aktif/Pasif Yapar
        /// </summary>
        [HttpPatch("{id:int}/toggle-status")]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> ToggleStatus(int id, [FromQuery] bool active)
        {
            var result = active ? await _careerService.ActivateCareerAsync(id) : await _careerService.DeactivateCareerAsync(id);
            if (!result)
                return NotFound(new { message = "İlan bulunamadı." });

            return Ok(new { message = $"İlan durumu {(active ? "aktif" : "pasif")} yapıldı." });
        }

        /// <summary>
        /// İlanı Siler
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _careerService.DeleteCareerAsync(id);
            if (!result)
                return NotFound(new { message = "İlan bulunamadı." });

            return Ok(new { message = "İlan başarıyla silindi." });
        }
    }
}
