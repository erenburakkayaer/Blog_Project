using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.DTO.Application;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        /// <summary>
        /// Adayın İş/Staj İlanına Başvuru Yapması (Ziyaretçiye Açık)
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Apply([FromBody] ApplicationCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newId = await _applicationService.CreateApplicationAsync(createDto);
            return Ok(new { id = newId, message = "Başvurunuz başarıyla alındı. İnsan Kaynakları ekibimiz en kısa sürede değerlendirecektir." });
        }

        /// <summary>
        /// Tüm Başvuruları ve CV'leri Listeler (Yönetici & İK)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var apps = await _applicationService.GetAllApplicationsAsync(page, pageSize);
            return Ok(apps);
        }

        /// <summary>
        /// Belirli Bir İlana Gelen Başvuruları Listeler
        /// </summary>
        [HttpGet("career/{careerId:int}")]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> GetByCareer(int careerId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var apps = await _applicationService.GetApplicationsByCareerAsync(careerId, page, pageSize);
            return Ok(apps);
        }

        /// <summary>
        /// ID'ye Göre Başvuru Detayını Getirir
        /// </summary>
        [HttpGet("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> GetById(int id)
        {
            var app = await _applicationService.GetApplicationByIdAsync(id);
            if (app == null)
                return NotFound(new { message = "Başvuru bulunamadı." });

            return Ok(app);
        }

        /// <summary>
        /// Başvuru Durumunu Günceller (İnceleniyor, Mülakat, Kabul, Red)
        /// </summary>
        [HttpPatch("{id:int}/status")]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] ApplicationUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _applicationService.UpdateApplicationStatusAsync(id, updateDto);
            if (!result)
                return NotFound(new { message = "Başvuru bulunamadı." });

            return Ok(new { message = "Başvuru durumu başarıyla güncellendi." });
        }

        /// <summary>
        /// Başvuruyu Siler
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin,HR")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _applicationService.DeleteApplicationAsync(id);
            if (!result)
                return NotFound(new { message = "Başvuru bulunamadı." });

            return Ok(new { message = "Başvuru başarıyla silindi." });
        }
    }
}
