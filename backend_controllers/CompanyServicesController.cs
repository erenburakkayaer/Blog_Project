using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.DTO.CompanyService;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/services")]
    public class CompanyServicesController : ControllerBase
    {
        private readonly ICompanyServiceService _serviceService;

        public CompanyServicesController(ICompanyServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        /// <summary>
        /// Tüm Aktif Hizmetleri Getirir (Web, Mobil, AI, Siber Güvenlik vb.)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetActiveServices()
        {
            var services = await _serviceService.GetActiveServicesAsync();
            return Ok(services);
        }

        /// <summary>
        /// Tüm Hizmetleri Getirir (Admin Paneli)
        /// </summary>
        [HttpGet("all")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _serviceService.GetAllServicesAsync();
            return Ok(services);
        }

        /// <summary>
        /// ID'ye Göre Hizmet Detayını Getirir
        /// </summary>
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service == null)
                return NotFound(new { message = "Hizmet bulunamadı." });

            return Ok(service);
        }

        /// <summary>
        /// Yeni Hizmet Oluşturur (Admin)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Create([FromBody] CompanyServiceCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newServiceId = await _serviceService.CreateServiceAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = newServiceId }, new { id = newServiceId, message = "Hizmet başarıyla eklendi." });
        }

        /// <summary>
        /// Mevcut Hizmeti Günceller (Admin)
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CompanyServiceUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _serviceService.UpdateServiceAsync(id, updateDto);
            if (!result)
                return NotFound(new { message = "Hizmet bulunamadı veya güncellenemedi." });

            return Ok(new { message = "Hizmet başarıyla güncellendi." });
        }

        /// <summary>
        /// Hizmeti Siler (Admin)
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _serviceService.DeleteServiceAsync(id);
            if (!result)
                return NotFound(new { message = "Hizmet bulunamadı." });

            return Ok(new { message = "Hizmet başarıyla silindi." });
        }
    }
}
