using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interface;
using AutoMapper;
using API.Extensions;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http.Features;
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

        public async Task<PageList<MemberDto>> GetAllDtoAsync(Params userParams)
        {
            var maxYear = DateTime.Today.AddYears(-((UserParams) userParams).MinAge);
            var minYear = DateTime.Today.AddYears(-((UserParams) userParams).MaxAge - 1); 
            var query = _context.Users
                .AsQueryable()
                .Where(item => 
                    (item.UserName != ((UserParams) userParams).CurrentUsername)
                    && (
                        ((UserParams) userParams).Gender == "all"
                        || 
                        item.Gender == ((UserParams) userParams).Gender
                    ) && item.DateOfBirth >= minYear 
                    && item.DateOfBirth <= maxYear);
            query = ((UserParams) userParams).OrderBy switch 
            {
                "created" => query.OrderByDescending(item => item.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };
            return await PageList<MemberDto>.CreateAsync(
                query
                    .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                    .AsNoTracking(), 
                userParams.PageNumber, userParams.PageSize);
        }

        public async Task<MemberDto> GetDtoByPKAsync(object id)
        {
            try {
                return await _context.Users
                    .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(item => 
                        item.Id == int.Parse(id.ToString()));
            } catch {}
            return null;
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

        public async Task<AppUser> GetByPKAsync(object pk)
        {
            try {
                return await _context.Users.Include(item => item.Photos).SingleOrDefaultAsync(item => item.Id == int.Parse(pk.ToString()));
            } catch {}
            return null;
        }
    }
}