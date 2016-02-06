using Microsoft.Azure.Mobile.Server;
using System.ComponentModel.DataAnnotations.Schema;

namespace circleappService.DataObjects
{
    public class Invitation : EntityData
    {
        [Index("IX_InvitationIndex", 1, IsUnique=true)]
        public string UserId { get; set; }
        public User User { get; set; }

        [Index("IX_InvitationIndex", 2, IsUnique=true)]
        public string EventId { get; set; }
        public Event Event { get; set; }
        public int Status { get; set; }
    }
}