using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interface;
using API.Service;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers 
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext context;
        private readonly ITokenService tokenService;
        private readonly IMapper mapper;
        public AccountController(DataContext ctx, ITokenService tokenService, IMapper mapper) {
            this.tokenService = tokenService;
            this.context = ctx;
            this.mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) {
            if (await CheckExisted(registerDto.Username))
                return BadRequest("Existed");

            var newUser = mapper.Map<AppUser>(registerDto);

            using var hmac = new HMACSHA512();
            newUser.UserName = registerDto.Username.ToLower();
            newUser.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            newUser.PasswordSalt = hmac.Key;

            context.Users.Add(newUser);
            int checkCreate = await context.SaveChangesAsync();
            if (checkCreate == 0)
                return BadRequest("Fail to register, please try later");

            return new UserDto {
                Username = newUser.UserName,
                Token = tokenService.CreateToken(newUser),
                KnownAs = newUser.KnownAs
            };
        }
        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto userDto) {
            var user = await context.Users
                        .Include(item => item.Photos)
                        .SingleOrDefaultAsync(item => 
                            item.UserName == userDto.Username.ToLower());
            if (user == null)
                return Unauthorized("Invalid username");
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var hashed = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.Password));
            if (hashed.Length != user.PasswordHash.Length)
                return Unauthorized("Invalid password");
            for (int i = 0; i < hashed.Length; i++)
                if (hashed[i] != user.PasswordHash[i])
                    return Unauthorized("Invalid password");
            return new UserDto() {
                Username = user.UserName,
                Token = tokenService.CreateToken(user),
                PhotoUrl = user.Photos?.SingleOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs
            };
        }
        private async Task<bool> CheckExisted(string username) 
        {
            try {
                return await context.Users.AnyAsync(item => 
                    item.UserName == username.ToLower());
            } catch {}
            return false;
        }
    }
}