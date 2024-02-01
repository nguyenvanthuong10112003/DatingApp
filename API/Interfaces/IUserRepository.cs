using API.DTOs;
using API.Entities;

namespace API.Interface
{
    public interface IUserRepository : IRepository<AppUser, MemberDto> {
        Task<AppUser> GetByUsernameAsync(string username);
        Task<MemberDto> GetDtoByUsernameAsync(string username);
    }
}