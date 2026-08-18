using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.DTO.User;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Tüm Kullanıcıları Listeler
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var users = await _userService.GetAllUsersAsync(page, pageSize);
            return Ok(users);
        }

        /// <summary>
        /// ID'ye Göre Kullanıcı Detayını Getirir
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "Kullanıcı bulunamadı." });

            var roles = await _userService.GetUserRoleNamesAsync(id);
            return Ok(new { user, roles });
        }

        /// <summary>
        /// Yeni Kullanıcı Oluşturur
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newUserId = await _userService.CreateUserAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = newUserId }, new { id = newUserId, message = "Kullanıcı başarıyla oluşturuldu." });
        }

        /// <summary>
        /// Mevcut Kullanıcıyı Günceller
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserdto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _userService.UpdateUserAsync(id, updateDto);
            if (!result)
                return NotFound(new { message = "Kullanıcı bulunamadı veya güncellenemedi." });

            return Ok(new { message = "Kullanıcı başarıyla güncellendi." });
        }

        /// <summary>
        /// Kullanıcıya Rol Atar
        /// </summary>
        [HttpPost("{id:int}/roles/{roleId:int}")]
        public async Task<IActionResult> AssignRole(int id, int roleId)
        {
            var result = await _userService.AssignRoleToUserAsync(id, roleId);
            if (!result)
                return BadRequest(new { message = "Rol atanamadı." });

            return Ok(new { message = "Rol başarıyla atandı." });
        }

        /// <summary>
        /// Kullanıcı Hesabını Kilitler / Kilidini Açar
        /// </summary>
        [HttpPatch("{id:int}/lock")]
        public async Task<IActionResult> ToggleLock(int id, [FromQuery] bool isLocked)
        {
            var result = isLocked 
                ? await _userService.LockUserAsync(id) 
                : await _userService.UnlockUserAsync(id);

            if (!result)
                return NotFound(new { message = "Kullanıcı bulunamadı." });

            return Ok(new { message = $"Kullanıcı {(isLocked ? "kilitlendi" : "kilidi açıldı")}." });
        }

        /// <summary>
        /// Kullanıcıyı Siler
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
                return NotFound(new { message = "Kullanıcı bulunamadı." });

            return Ok(new { message = "Kullanıcı silindi." });
        }
    }
}
