using System.Data.SqlTypes;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interface;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    [Route("api/users")]
    public class UserController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UserController(IUserRepository userRepository, IMapper mapper) 
        {
            this._userRepository = userRepository;
            this._mapper = mapper;
        }
        //api/users
        [HttpGet()]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            return Ok(await _userRepository.GetAllDtoAsync());
        }
        //api/users/id
        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetUsers(int id) 
        {
            if (id <= 0)
                return BadRequest("Id is invalid");
            return await _userRepository.GetDtoByPKAsync(id);
        }
    }
}