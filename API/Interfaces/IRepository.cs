using API.Entities;
using API.Helpers;

namespace API.Interface
{
    public interface IRepository <T,TDto>
    {
        void Update(T t);
        Task<bool> SaveAllAsync();
        Task<PageList<TDto>> GetAllDtoAsync(Params _params);
        Task<TDto> GetDtoByPKAsync(object pk);
        Task<T> GetByPKAsync(object pk);
    }
}