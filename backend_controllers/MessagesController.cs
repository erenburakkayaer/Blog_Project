using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.DTO.Message;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        /// <summary>
        /// İletişim Formundan Yeni Mesaj Gönderir (Ziyaretçiye Açık)
        /// </summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromBody] MessageCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? userId = int.TryParse(userIdClaim, out int uid) ? uid : null;

            var newId = await _messageService.CreateMessageAsync(createDto, ipAddress, userId);
            return Ok(new { id = newId, message = "Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız." });
        }

        /// <summary>
        /// Tüm Mesajları Listeler (Admin & Editör)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var messages = await _messageService.GetAllMessagesAsync(page, pageSize);
            return Ok(messages);
        }

        /// <summary>
        /// ID'ye Göre Mesaj Detayını Getirir
        /// </summary>
        [HttpGet("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> GetById(int id)
        {
            var message = await _messageService.GetMessageByIdAsync(id);
            if (message == null)
                return NotFound(new { message = "Mesaj bulunamadı." });

            return Ok(message);
        }

        /// <summary>
        /// Mesajı Okundu Olarak İşaretler
        /// </summary>
        [HttpPatch("{id:int}/read")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var result = await _messageService.MarkAsReadAsync(id);
            if (!result)
                return NotFound(new { message = "Mesaj bulunamadı." });

            return Ok(new { message = "Mesaj okundu olarak işaretlendi." });
        }

        /// <summary>
        /// Mesaja Cevap Yazar ve E-posta Gönderir
        /// </summary>
        [HttpPost("{id:int}/reply")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> Reply(int id, [FromBody] MessageReplyDto replyDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _messageService.ReplyToMessageAsync(id, replyDto);
            if (!result)
                return NotFound(new { message = "Mesaj bulunamadı veya cevap gönderilemedi." });

            return Ok(new { message = "Cevap başarıyla kaydedildi ve e-posta gönderildi." });
        }

        /// <summary>
        /// Mesajı Siler
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _messageService.DeleteMessageAsync(id);
            if (!result)
                return NotFound(new { message = "Mesaj bulunamadı." });

            return Ok(new { message = "Mesaj başarıyla silindi." });
        }
    }
}
