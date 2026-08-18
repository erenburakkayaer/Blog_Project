using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.DTO.Project;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        /// <summary>
        /// Aktif Projeleri Listeler (Sayfalama Destekli)
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetActive([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var projects = await _projectService.GetActiveProjectsAsync(page, pageSize);
            return Ok(projects);
        }

        /// <summary>
        /// Öne Çıkarılmış (Boosted / Featured) Projeleri Listeler
        /// </summary>
        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFeatured([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var projects = await _projectService.GetFeaturedProjectsAsync(page, pageSize);
            return Ok(projects);
        }

        /// <summary>
        /// Tüm Projeleri Listeler (Admin Paneli)
        /// </summary>
        [HttpGet("all")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var projects = await _projectService.GetAllProjectsAsync(page, pageSize);
            return Ok(projects);
        }

        /// <summary>
        /// ID'ye Göre Proje Detayını Getirir
        /// </summary>
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);
            if (project == null)
                return NotFound(new { message = "Proje bulunamadı." });

            return Ok(project);
        }

        /// <summary>
        /// Slug'a Göre Proje Detayını Getirir
        /// </summary>
        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var project = await _projectService.GetProjectBySlugAsync(slug);
            if (project == null)
                return NotFound(new { message = "Proje bulunamadı." });

            return Ok(project);
        }

        /// <summary>
        /// Yeni Proje Oluşturur
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ProjectCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newProjectId = await _projectService.CreateProjectAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = newProjectId }, new { id = newProjectId, message = "Proje başarıyla oluşturuldu." });
        }

        /// <summary>
        /// Mevcut Projeyi Günceller
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _projectService.UpdateProjectAsync(id, updateDto);
            if (!result)
                return NotFound(new { message = "Proje bulunamadı veya güncellenemedi." });

            return Ok(new { message = "Proje başarıyla güncellendi." });
        }

        /// <summary>
        /// Projeyi Öne Çıkar (Boost / Feature)
        /// </summary>
        [HttpPost("{id:int}/boost")]
        [Authorize]
        public async Task<IActionResult> FeatureProject(int id)
        {
            var result = await _projectService.FeatureProjectAsync(id);
            if (!result)
                return NotFound(new { message = "Proje bulunamadı." });

            return Ok(new { message = "Proje başarıyla öne çıkarıldı (Boosted)." });
        }

        /// <summary>
        /// Projeyi Aktif / Pasif Yap
        /// </summary>
        [HttpPatch("{id:int}/toggle-status")]
        [Authorize(Roles = "SuperAdmin,Admin,Editor")]
        public async Task<IActionResult> ToggleStatus(int id, [FromQuery] bool active)
        {
            var result = active 
                ? await _projectService.ActivateProjectAsync(id) 
                : await _projectService.DeactivateProjectAsync(id);

            if (!result)
                return NotFound(new { message = "Proje bulunamadı." });

            return Ok(new { message = $"Proje durumu {(active ? "aktif" : "pasif")} yapıldı." });
        }

        /// <summary>
        /// Projeyi Siler
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _projectService.DeleteProjectAsync(id);
            if (!result)
                return NotFound(new { message = "Proje bulunamadı." });

            return Ok(new { message = "Proje başarıyla silindi." });
        }

        /// <summary>
        /// Proje Arama (Başlığa Göre)
        /// </summary>
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> Search([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest(new { message = "Arama terimi giriniz." });

            var results = await _projectService.SearchProjectsByTitleAsync(query, page, pageSize);
            return Ok(results);
        }
    }
}
