using BackZombieLand.Model.MyAuthentication;
using BackZombieLand.Model.MyAuthentication.Response;

namespace BackZombieLand.services {
    public interface IUserService {
        public UserResponse Authentication(AuthRequest authRequest);
    }
}
