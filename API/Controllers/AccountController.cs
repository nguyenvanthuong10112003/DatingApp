using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interface;
using API.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers 
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext context;
        private readonly ITokenService tokenService;
        public AccountController(DataContext ctx, ITokenService tokenService) {
            this.tokenService = tokenService;
            this.context = ctx;
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto userDto) {
            if (await CheckExisted(userDto.Username))
                return BadRequest("Existed");
            using var hmac = new HMACSHA512();
            var newUser = new AppUser() {
                UserName = userDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.Password)),
                PasswordSalt = hmac.Key
            };
            context.Users.Add(newUser);
            int checkCreate = await context.SaveChangesAsync();
            if (checkCreate == 0)
                return BadRequest("An error, please try later");
            return new UserDto() {
                Username = newUser.UserName,
                Token = tokenService.CreateToken(newUser)
            };
        }
        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto userDto) {
            var user = await context.Users.Where(item => 
                    item.UserName == userDto.Username.ToLower()
                ).SingleOrDefaultAsync();
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
                Token = tokenService.CreateToken(user)
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