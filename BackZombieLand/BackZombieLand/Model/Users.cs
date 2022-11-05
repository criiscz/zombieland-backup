using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BackZombieLand.Model
{
    public class Users
    {
        [Key]
        public int id { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string nickName { get; set; }
        [Required]
        [Column(TypeName = "varchar(250)")]
        public string email{ get; set; }
        [Required]
        [Column(TypeName = "varchar(250)")]
        public string password { get; set; }
    }
}
