using BackZombieLand.Model;
using BackZombieLand.Model.MyAuthentication;
using BackZombieLand.Model.MyAuthentication.Response;
using BackZombieLand.uilities;
using Data;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackZombieLand.services.implementation {
    public class UserService : IUserService {
        private readonly BackZombieLandContext myBackZombieLandContext;
        private readonly AppSettings _appSettings;
        public UserService(BackZombieLandContext myBackZombieLandContext, IOptions<AppSettings> appSettings) {
            this.myBackZombieLandContext = myBackZombieLandContext;
            _appSettings = appSettings.Value;
        }

        public UserResponse Authentication(AuthRequest authRequest) {
            UserResponse userResponse = new UserResponse();

            string userPassword = Encrypt.GetSHA256(authRequest.password); // viene desencriptamos entonces la encriptamos

            //hacemos la query que valide que esa contrasenia coincida con la que tiene el usuario
            var userFound = myBackZombieLandContext.Users.Where(u => u.nickName == authRequest.nickName
                                        && u.password == userPassword).FirstOrDefault();
            if (userFound == null) {
                return null;
            }
            userResponse.nickName = userFound.nickName;
            userResponse.token = GetToken(userFound);

            return userResponse;
        }

        private string GetToken(Users userFound) {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.secret);
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(
                    new Claim[] {
                        new Claim(ClaimTypes.NameIdentifier, userFound.id.ToString()),
                        new Claim(ClaimTypes.Email, userFound.email),//if we want many claims here we can create them.
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),SecurityAlgorithms.HmacSha256Signature)//here is where encrypt the datas!
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
