using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.DTO.Offer;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OffersController : ControllerBase
    {
        private readonly IOfferService _offerService;

        public OffersController(IOfferService offerService)
        {
            _offerService = offerService;
        }

        /// <summary>
        /// 3 Adımlı Teklif Sihirbazından Yeni Teklif Talebi Oluşturur
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] OfferCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int requesterUserId = int.TryParse(userIdClaim, out int uid) ? uid : 0;

            var newOfferId = await _offerService.CreateOfferAsync(createDto, requesterUserId);
            return Ok(new { id = newOfferId, message = "Teklif talebiniz başarıyla alındı. 24 saat içinde size dönüş yapacağız." });
        }

        /// <summary>
        /// Tüm Teklif Taleplerini Listeler (Admin & Editör)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var offers = await _offerService.GetAllOffersAsync(page, pageSize);
            return Ok(offers);
        }

        /// <summary>
        /// ID'ye Göre Teklif Detayını Getirir
        /// </summary>
        [HttpGet("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> GetById(int id)
        {
            var offer = await _offerService.GetOfferByIdAsync(id);
            if (offer == null)
                return NotFound(new { message = "Teklif talebi bulunamadı." });

            return Ok(offer);
        }

        /// <summary>
        /// Teklife Şirket Tarafından Fiyat ve Kapsam Yanıtı Verir
        /// </summary>
        [HttpPost("{id:int}/respond")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Respond(int id, [FromBody] OfferCompanyDto responseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _offerService.RespondToOfferAsync(id, responseDto);
            if (!result)
                return NotFound(new { message = "Teklif bulunamadı veya yanıt kaydedilemedi." });

            return Ok(new { message = "Teklif yanıtı kaydedildi ve müşteriye e-posta iletildi." });
        }

        /// <summary>
        /// Teklif Durumunu Günceller
        /// </summary>
        [HttpPatch("{id:int}/status")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] OfferStatusUpdateDto statusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _offerService.UpdateOfferStatusAsync(id, statusDto);
            if (!result)
                return NotFound(new { message = "Teklif bulunamadı." });

            return Ok(new { message = "Teklif durumu güncellendi." });
        }

        /// <summary>
        /// Teklifi Siler
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _offerService.DeleteOfferAsync(id);
            if (!result)
                return NotFound(new { message = "Teklif bulunamadı." });

            return Ok(new { message = "Teklif başarıyla silindi." });
        }
    }
}
