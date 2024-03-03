namespace API.Helpers
{
    public class UserParams : Params {
        public string? CurrentUsername {get; set;}
        public string Gender {set; get;} = "all";
        public int MinAge {get; set;} = 18;
        public int MaxAge {get; set;} = 100;
        public string OrderBy {get; set;} = "lastActive";
    }
}