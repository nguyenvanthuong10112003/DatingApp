using System.Data.SqlTypes;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/users")]
    public class UserController : BaseApiController
    {
        private readonly DataContext context;
        public UserController(DataContext context) 
        {
            this.context = context;
        }
        //api/users
        [HttpGet()]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await context.Users.ToListAsync();
        }
        //api/users/id
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<AppUser>> GetUsers(int id) 
        {
            if (id <= 0)
                return BadRequest("List is null");
            return await context.Users.FindAsync(id);
        }
    }
}