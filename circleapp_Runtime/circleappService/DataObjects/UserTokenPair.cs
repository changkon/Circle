using Microsoft.Azure.Mobile.Server;
using System.ComponentModel.DataAnnotations.Schema;

namespace circleappService.DataObjects
{
    public class UserTokenPair : EntityData
    {
        [Index("IX_TokenIndex", 1, IsUnique=true)]
        public string UserId { get; set; }
        public User User { get; set; }

        [Index("IX_TokenIndex", 2, IsUnique=true)]
        public string DeviceToken { get; set; }
    }
}