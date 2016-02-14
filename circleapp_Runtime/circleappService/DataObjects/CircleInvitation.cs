using Microsoft.Azure.Mobile.Server;
using System.ComponentModel.DataAnnotations.Schema;

namespace circleappService.DataObjects
{
    public class CircleInvitation : EntityData
    {
        [Index("IX_CircleIndex", 1, IsUnique=true)]
        public string UserId { get; set; }
        public User User { get; set; }

        [Index("IX_CircleIndex", 2, IsUnique=true)]
        public string CircleId { get; set; }
        public Circle Circle { get; set; }
        public int Status { get; set; }
    }
}