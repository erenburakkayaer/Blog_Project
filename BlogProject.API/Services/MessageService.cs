using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    // İş kuralı: okundu/önemli/arşiv durumuna göre filtreleme
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;

        public MessageService(IMessageRepository messageRepository, IMapper mapper)
        {
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<MessageDto>> GetFilteredPagedAsync(
            int page, int pageSize, string? search, bool? isRead, bool? isImportant, bool? isArchived)
        {
            var (messages, totalCount) = await _messageRepository.GetFilteredPagedAsync(
                page, pageSize, search, isRead, isImportant, isArchived);

            return new PagedResultDto<MessageDto>
            {
                Items = _mapper.Map<IEnumerable<MessageDto>>(messages),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<MessageDto?> GetByIdAsync(int id)
        {
            var message = await _messageRepository.GetByIdAsync(id);
            return message is null ? null : _mapper.Map<MessageDto>(message);
        }

        public async Task<MessageDto> CreateAsync(MessageCreateDto dto)
        {
            var message = _mapper.Map<Message>(dto);

            await _messageRepository.AddAsync(message);
            await _messageRepository.SaveChangesAsync();

            return _mapper.Map<MessageDto>(message);
        }

        public async Task<bool> UpdateAsync(int id, MessageUpdateDto dto)
        {
            var message = await _messageRepository.GetByIdAsync(id);
            if (message is null) return false;

            _mapper.Map(dto, message);
            _messageRepository.Update(message);
            return await _messageRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var message = await _messageRepository.GetByIdAsync(id);
            if (message is null) return false;

            _messageRepository.Remove(message);
            return await _messageRepository.SaveChangesAsync();
        }
    }
}
