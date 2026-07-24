namespace BlogProject.API.Interfaces
{
    // Tüm entity'lerde ortak olan temel CRUD sözleşmesi
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search = null);
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        void Update(T entity);
        void Remove(T entity);
        Task<bool> SaveChangesAsync();
    }
}
