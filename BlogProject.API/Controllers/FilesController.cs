using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFileStorageService _fileStorageService;

        public FilesController(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        // Ziyaretçi CV/görsel yükleyebilir (Teklif Al, Kariyer başvurusu formları için) — anonim
        [HttpPost("upload")]
        [AllowAnonymous]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<ActionResult<FileAssetDto>> Upload(IFormFile file)
        {
            try
            {
                var result = await _fileStorageService.SaveAsync(file);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FileAssetDto>>> GetAll() =>
            Ok(await _fileStorageService.GetAllAsync());

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id) =>
            await _fileStorageService.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
