using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    public class LogService : ILogService
    {
        private readonly IGenericRepository<Log> _logRepository;
        private readonly IMapper _mapper;

        public LogService(IGenericRepository<Log> logRepository, IMapper mapper)
        {
            _logRepository = logRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LogDto>> GetAllAsync()
        {
            var logs = await _logRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<LogDto>>(logs);
        }

        public async Task<LogDto?> GetByIdAsync(int id)
        {
            var log = await _logRepository.GetByIdAsync(id);
            return log is null ? null : _mapper.Map<LogDto>(log);
        }
    }
}
