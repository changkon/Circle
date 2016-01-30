using Microsoft.Azure.Mobile.Server;

namespace circleappService.DataObjects
{
    public class User : EntityData
    {
        
        public string Email  {
            get;
            set;
        }

        public string PhoneNumber
        {
            get;
            set;
        }

        public string Password
        {
            get;
            set;
        }

        public string Gender
        {
            get;
            set;
        }

        public string Name
        {
            get;
            set;
        }

        public int Age
        {
            get;
            set;
        }
    }
}