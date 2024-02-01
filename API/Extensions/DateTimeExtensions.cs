namespace API.Extensions 
{
    public static class DateTimeExtensions {
        public static int CalculateAge(this DateTime dob) {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;
            if (dob.Month > today.Month)
                age--;
            return age;
        }
    }
}