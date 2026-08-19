namespace Staj_proje.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        Task CommitAsync();
        void Rollback();
    }
}