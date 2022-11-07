using BackZombieLand.Model.MyAuthentication;
using BackZombieLand.services;
using Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackZombieLand.Controllers {
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
            Console.Write("\nUsuario => " + authRequest.nickName
                       + "\npassword => " + authRequest.password);
            var userResponse = _userService.Authentication(authRequest);

            Console.Write("\n Found user => " + userResponse
                        + "\n Found password => " + userResponse);
            if (userResponse == null)
                return BadRequest("Invalid credentials!");


            return Ok(userResponse);
        }
    }
}
