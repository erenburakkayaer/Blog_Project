using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    // İş kuralı: ziyaretçiye açık yorum listesinde sadece onaylı (IsApproved) yorumlar gösterilir
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IMapper _mapper;

        public CommentService(ICommentRepository commentRepository, IMapper mapper)
        {
            _commentRepository = commentRepository;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<CommentDto>> GetPagedAsync(int page, int pageSize, string? search = null)
        {
            var (comments, totalCount) = await _commentRepository.GetPagedAsync(page, pageSize, search);
            return new PagedResultDto<CommentDto>
            {
                Items = _mapper.Map<IEnumerable<CommentDto>>(comments),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<CommentDto?> GetByIdAsync(int id)
        {
            var comment = await _commentRepository.GetByIdAsync(id);
            return comment is null ? null : _mapper.Map<CommentDto>(comment);
        }

        public async Task<IEnumerable<CommentDto>> GetApprovedByBlogIdAsync(int blogId)
        {
            var comments = await _commentRepository.GetApprovedByBlogIdAsync(blogId);
            return _mapper.Map<IEnumerable<CommentDto>>(comments);
        }

        public async Task<CommentDto> CreateAsync(CommentCreateDto dto)
        {
            var comment = _mapper.Map<Comment>(dto);

            await _commentRepository.AddAsync(comment);
            await _commentRepository.SaveChangesAsync();

            return _mapper.Map<CommentDto>(comment);
        }

        public async Task<bool> UpdateAsync(int id, CommentUpdateDto dto)
        {
            var comment = await _commentRepository.GetByIdAsync(id);
            if (comment is null) return false;

            _mapper.Map(dto, comment);
            _commentRepository.Update(comment);
            return await _commentRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var comment = await _commentRepository.GetByIdAsync(id);
            if (comment is null) return false;

            _commentRepository.Remove(comment);
            return await _commentRepository.SaveChangesAsync();
        }
    }
}
