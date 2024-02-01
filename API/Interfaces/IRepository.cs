using API.Entities;

namespace API.Interface
{
    public interface IRepository <T,TDto>
    {
        void Update(T t);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByPKAsync(object pk);
        Task<IEnumerable<TDto>> GetAllDtoAsync();
        Task<TDto> GetDtoByPKAsync(object pk);
    }
}