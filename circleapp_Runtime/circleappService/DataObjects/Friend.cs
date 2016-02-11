using Microsoft.Azure.Mobile.Server;
using System.ComponentModel.DataAnnotations.Schema;

namespace circleappService.DataObjects
{
    public class Friend : EntityData
    {
        [Index("IX_FriendIndex", 1, IsUnique = true)]
        public string UserId { get; set; } //the friend who's userId comes first in the alphabet

        [Index("IX_FriendIndex", 2, IsUnique = true)]
        public string FriendUserId { get; set; }

        public int Status { get; set; } //0 is pending, 1 is accepted
 
        public string ActionUserId { get; set; }

        public User User { get; set; }
    }
}