using Microsoft.Build.Framework;

namespace BackZombieLand.Model.MyAuthentication
{
    public class AuthRequest
    {
        [Required]
        public string nickName { get; set; }
        [Required]
        public string password { get; set; }
    }
}
