using System.Buffers.Text;
using System.Security.Cryptography;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interface;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper) {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) {
            if (await CheckExisted(registerDto.Username))
                return BadRequest("Existed");

            var newUser = _mapper.Map<AppUser>(registerDto);

            newUser.UserName = registerDto.Username.ToLower();

            var result = await _userManager.CreateAsync(newUser, registerDto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(newUser, "Member");

            if (!roleResult.Succeeded) 
                return BadRequest(result.Errors);

            return new UserDto {
                Username = newUser.UserName,
                Token = await _tokenService.CreateToken(newUser),
                Gender = newUser.Gender,
                KnownAs = newUser.KnownAs
            };
        }
        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto userDto) {
            var user = await _userManager.Users
                        .Include(item => item.Photos)
                        .SingleOrDefaultAsync(item => 
                            item.UserName == userDto.Username.ToLower());
            
            if (user == null)
                return Unauthorized("Invalid username");

            var result = await _signInManager.CheckPasswordSignInAsync(user, userDto.Password, false);

            if (!result.Succeeded)
                return Unauthorized();

            return new UserDto() {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos?.SingleOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }
        private async Task<bool> CheckExisted(string username) 
        {
            return await _userManager.Users.AnyAsync(item => 
                item.UserName == username.ToLower());
        }
    }
}