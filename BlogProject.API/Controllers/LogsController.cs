using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = RoleNames.AdminOnly)]
    public class LogsController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogsController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogDto>>> GetAll() => Ok(await _logService.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<ActionResult<LogDto>> GetById(int id)
        {
            var log = await _logService.GetByIdAsync(id);
            return log is null ? NotFound() : Ok(log);
        }
    }
}
