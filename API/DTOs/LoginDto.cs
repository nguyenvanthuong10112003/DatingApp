using System.ComponentModel.DataAnnotations;

namespace API.DTOs 
{
    public class LoginDto {
        [Required]
        public string Username {set; get;}
        [Required]
        public string Password {set; get;}
        public bool? KeepLogin {set; get;}
    }
}