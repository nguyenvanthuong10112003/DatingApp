namespace API.Helpers
{
    public class MessageParams : Params 
    {
        public string? Username {get; set;}
        public string Container {get; set;} = "Unread";
    }
}