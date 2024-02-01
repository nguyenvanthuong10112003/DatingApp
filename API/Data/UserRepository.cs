using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AppUser>> GetAllAsync()
        {
            return await _context.Users.Include(p => p.Photos).ToListAsync();
        }

        public async Task<IEnumerable<MemberDto>> GetAllDtoAsync()
        {
            return await _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<AppUser> GetByPKAsync(object id)
        {
            try {
                id = int.Parse(id.ToString());
                return await _context.Users.FindAsync(id);
            } catch {
                return null;
            }
        }

        public async Task<MemberDto> GetDtoByPKAsync(object id)
        {
            try {
                id = int.Parse(id.ToString());
                return await _context.Users
                    .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(item => 
                        item.Id == (int)id);
            } catch {
                return null;
            }
        }

        public async Task<AppUser> GetByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(item => 
                    item.UserName == username);
        }

        public async Task<MemberDto> GetDtoByUsernameAsync(string username)
        {
            return await _context.Users
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(item => 
                    item.UserName == username);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}