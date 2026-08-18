using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // İletişim formu — ziyaretçi mesaj gönderebilir (POST anonim); okuma/filtreleme personelde
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<MessageDto>>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? search = null,
            [FromQuery] bool? isRead = null,
            [FromQuery] bool? isImportant = null,
            [FromQuery] bool? isArchived = null) =>
            Ok(await _messageService.GetFilteredPagedAsync(page, pageSize, search, isRead, isImportant, isArchived));

        [HttpGet("{id:int}")]
        public async Task<ActionResult<MessageDto>> GetById(int id)
        {
            var item = await _messageService.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<MessageDto>> Create(MessageCreateDto dto)
        {
            var created = await _messageService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, MessageUpdateDto dto) =>
            await _messageService.UpdateAsync(id, dto) ? NoContent() : NotFound();

        // Not: e-posta gönderimi yapılmıyor (SMTP servisi yok) — yanıt sadece kayıt altına alınıyor
        [HttpPost("{id:int}/reply")]
        public async Task<IActionResult> Reply(int id, MessageReplyDto dto) =>
            await _messageService.ReplyAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id) =>
            await _messageService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
