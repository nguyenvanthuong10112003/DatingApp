using System.ComponentModel.DataAnnotations;

namespace API.DTOs 
{
    public class RegisterDto {
        [Required]
        public string Username {set; get;}
        [Required]
        public string KnownAs {set; get;}
        [Required]
        public string Gender {set; get;}
        [Required]
        public DateTime DateOfBirth {set; get;}
        [Required]
        public string City {get; set;}
        [Required]
        public string Country {get; set;}
        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password {set; get;}
    }
}