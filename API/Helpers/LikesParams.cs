namespace API.Helpers
{
    public class LikesParams : Params 
    {
        public int UserId {get; set;}
        public string Predicate {get; set;}
    }
}