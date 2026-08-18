using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.DTO.Blog;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogsController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        /// <summary>
        /// Tüm Yayındaki Blogları Getirir (Ziyaretçiye Açık)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllPublished()
        {
            var blogs = await _blogService.GetPublishedBlogsAsync();
            return Ok(blogs);
        }

        /// <summary>
        /// Yönetim İçin Tüm Blogları Getirir (Admin & Editör)
        /// </summary>
        [HttpGet("all")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _blogService.GetAllBlogsAsync();
            return Ok(blogs);
        }

        /// <summary>
        /// ID'ye Göre Blog Detayını Getirir
        /// </summary>
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var blog = await _blogService.GetBlogByIdAsync(id);
            if (blog == null)
                return NotFound(new { message = "Blog yazısı bulunamadı." });

            return Ok(blog);
        }

        /// <summary>
        /// Kategoriye Göre Blogları Getirir
        /// </summary>
        [HttpGet("category/{categoryId:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var blogs = await _blogService.GetBlogsByCategoryAsync(categoryId);
            return Ok(blogs);
        }

        /// <summary>
        /// Yazarın Kendi Bloglarını Getirir
        /// </summary>
        [HttpGet("my-blogs")]
        [Authorize]
        public async Task<IActionResult> GetMyBlogs()
        {
            var userId = GetCurrentUserId();
            var blogs = await _blogService.GetBlogsByAuthorAsync(userId);
            return Ok(blogs);
        }

        /// <summary>
        /// Yeni Blog Yazısı Oluşturur
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] BlogCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var authorId = GetCurrentUserId();
            var newBlogId = await _blogService.CreateBlogAsync(createDto, authorId);

            return CreatedAtAction(nameof(GetById), new { id = newBlogId }, new { id = newBlogId, message = "Blog başarıyla oluşturuldu." });
        }

        /// <summary>
        /// Mevcut Blog Yazısını Günceller
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] BlogUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var authorId = GetCurrentUserId();
            var result = await _blogService.UpdateBlogAsync(id, updateDto, authorId);
            if (!result)
                return NotFound(new { message = "Blog yazısı bulunamadı veya düzenleme yetkiniz yok." });

            return Ok(new { message = "Blog yazısı başarıyla güncellendi." });
        }

        /// <summary>
        /// Blog Yazısını Yayınlar
        /// </summary>
        [HttpPatch("{id:int}/publish")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> Publish(int id)
        {
            var authorId = GetCurrentUserId();
            var result = await _blogService.PublishBlogAsync(id, authorId);
            if (!result)
                return NotFound(new { message = "Blog bulunamadı." });

            return Ok(new { message = "Blog yayına alındı." });
        }

        /// <summary>
        /// Blog Yazısını Yayından Kaldırır
        /// </summary>
        [HttpPatch("{id:int}/unpublish")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> Unpublish(int id)
        {
            var authorId = GetCurrentUserId();
            var result = await _blogService.UnpublishBlogAsync(id, authorId);
            if (!result)
                return NotFound(new { message = "Blog bulunamadı." });

            return Ok(new { message = "Blog yayından kaldırıldı." });
        }

        /// <summary>
        /// Blog Yazısını Siler (Soft Delete)
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var authorId = GetCurrentUserId();
            var result = await _blogService.DeleteBlogAsync(id, authorId);
            if (!result)
                return NotFound(new { message = "Blog bulunamadı veya silme yetkiniz yok." });

            return Ok(new { message = "Blog yazısı silindi." });
        }

        /// <summary>
        /// Başlık ve İçeriğe Göre Blog Arama
        /// </summary>
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return BadRequest(new { message = "Arama kelimesi giriniz." });

            var results = await _blogService.SearchBlogsAsync(keyword);
            return Ok(results);
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(claim, out int userId);
            return userId;
        }
    }
}
