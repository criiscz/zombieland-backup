using BackZombieLand.Model;
using BackZombieLand.Model.MyAuthentication;
using BackZombieLand.services;
using BackZombieLand.uilities;
using Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackZombieLand.Controllers {
    [EnableCors("Policy_any_origin")]
    //[EnableCors]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase {

        private readonly BackZombieLandContext _context;
        private IUserService _userService;

        public AuthController(BackZombieLandContext context, IUserService userService) {
            _context = context;
            _userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Authentication([FromBody] AuthRequest authRequest) {
            var userResponse = _userService.Authentication(authRequest);
            if (userResponse == null)
                return BadRequest("Invalid credentials!");
            return Ok(userResponse);
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("registry")]
        public async Task<ActionResult<Users>> PostUsers(Users users) {
            users.password = Encrypt.GetSHA256(users.password);
            _context.Users.Add(users);
            await _context.SaveChangesAsync();
            //return CreatedAtAction("GetUsers", new { id = users.id }, users);
            return new ObjectResult(users) { StatusCode = 200};
        }
    }
}
