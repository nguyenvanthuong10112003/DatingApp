using System.ComponentModel.DataAnnotations;

namespace API.DTOs 
{
    public class RegisterDto {
        [Required]
        public string Username {set; get;}
        [Required]
        public string Password {set; get;}
    }
}