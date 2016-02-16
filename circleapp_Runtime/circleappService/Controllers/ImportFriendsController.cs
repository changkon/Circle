using System.Web.Http;
using Microsoft.Azure.Mobile.Server.Config;
using System.Web.Http.Cors;
using System.Net.Http;
using circleappService.Models;
using System.Net;
using System.Linq;
using System;
using System.Text;
using System.Dynamic;
using circleappService.Utility;

namespace circleappService.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [MobileAppController]
    #if Test
    #else
        [Authorize]
    #endif
    public class ImportFriendsController : ApiController
    {
        // GET api/ImportFriends/GetValidUsersByPhoneNumber
        public HttpResponseMessage GetValidUsersByPhoneNumber()
        {
            var parameters = this.Request.GetQueryNameValuePairs();
            if (parameters.Count() > 0)
            {
                circleappContext ctx = new circleappContext();
                var phoneNumbers = parameters.ElementAt(0).Value.Split(',');
                var friends = ctx.Users.Where(x => phoneNumbers.Contains(x.PhoneNumber));

                return this.Request.CreateResponse(HttpStatusCode.OK, new
                {
                    Friends = friends
                });
            }
            else
            {
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, new { });
            }
        }

        // GET api/ImportFriends/GetNonUsersByPhoneNumber
        public HttpResponseMessage GetNonUsersByPhoneNumber()
         {
             var parameters = this.Request.GetQueryNameValuePairs();
             if (parameters.Count() > 0)
             {
                 circleappContext ctx = new circleappContext();
                 var phoneNumbers = parameters.ElementAt(0).Value.Split(',');
                 var friendPhoneNumbers = ctx.Users.Where(x => phoneNumbers.Contains(x.PhoneNumber)).Select(u => u.PhoneNumber);
                 var missingPhoneNumbers = phoneNumbers.Except(friendPhoneNumbers);

                 return this.Request.CreateResponse(HttpStatusCode.OK, new
                 {
                     MissingNumbers = missingPhoneNumbers
                 });
             }
             else
             {
                 return this.Request.CreateResponse(HttpStatusCode.BadRequest, new { });
             }
         }

        // GET api/ImportFriends/GetFriendsByName
        public HttpResponseMessage GetFriendsByName()
         {
             var parameters = this.Request.GetQueryNameValuePairs();
             if (parameters.Count() > 0)
             {
                 circleappContext ctx = new circleappContext();
                 var name = parameters.ElementAt(0).Value;
                 var users = ctx.Users.Where(x => x.Name.Contains(name));

                 return this.Request.CreateResponse(HttpStatusCode.OK, new
                 {
                     Users = users
                 });
             }
             else
             {
                 return this.Request.CreateResponse(HttpStatusCode.BadRequest, new { });
             }
         }

        // GET api/ImportFriends/GetAllFriends?userId=xxx
        public HttpResponseMessage GetAllFriends()
         {
             var parameters = this.Request.GetQueryNameValuePairs();
             if (parameters.Count() > 0)
             {
                circleappContext ctx = new circleappContext();
                var userId = parameters.ElementAt(0).Value;
                var friendIds1 = ctx.Friends.Where(x => x.UserId == userId && x.Status == 1).Select(u => u.FriendUserId);
                var friendIds2 = ctx.Friends.Where(x => x.FriendUserId == userId && x.Status == 1).Select(u => u.UserId);
                var friendUsers = ctx.Users.Where(x => friendIds1.Contains(x.Id) || friendIds2.Contains(x.Id));

                var friendIds3 = ctx.Friends.Where(x => x.UserId == userId && x.ActionUserId == userId && x.Status == 0).Select(u => u.FriendUserId);
                var friendIds4 = ctx.Friends.Where(x => x.FriendUserId == userId && x.ActionUserId == userId && x.Status == 0).Select(u => u.UserId);
                var pendingFriendUsers = ctx.Users.Where(x => friendIds3.Contains(x.Id) || friendIds4.Contains(x.Id));

                var friendIds5 = ctx.Friends.Where(x => x.UserId == userId && x.ActionUserId != userId && x.Status == 0).Select(u => u.FriendUserId);
                var friendIds6 = ctx.Friends.Where(x => x.FriendUserId == userId && x.ActionUserId != userId && x.Status == 0).Select(u => u.UserId);
                var requestFriendUsers = ctx.Users.Where(x => friendIds5.Contains(x.Id) || friendIds6.Contains(x.Id));

                return this.Request.CreateResponse(HttpStatusCode.OK, new
                {
                    AllFriends = friendUsers,
                    PendingFriends = pendingFriendUsers,
                    Requests = requestFriendUsers
                });
             }
             else
             {
                 return this.Request.CreateResponse(HttpStatusCode.BadRequest, new { });
             }
         }

        // GET api/ImportFriends/SendPushNotification
        public HttpResponseMessage GetSendPushNotification()
        {
            var parameters = this.Request.GetQueryNameValuePairs();
            if (parameters.Count() > 0)
            {
                string userId = parameters.ElementAt(0).Value;
                string friendId = parameters.ElementAt(1).Value;
                string friendTableId = parameters.ElementAt(2).Value;
                dynamic data = getJsonDataForPushNotification(userId, friendId, friendTableId);
                PushNotification.Send(data);
                return this.Request.CreateResponse(HttpStatusCode.OK, new { });
            }
            else
            {
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, new { });
            }
        }

        private dynamic getJsonDataForPushNotification(string userId, string friendId, string friendTableId)
        {
            circleappContext context = new circleappContext();
            var tokens = context.UserTokenPairs.Where(x => x.UserId == friendId).Select(x => x.DeviceToken).ToList();
            var user = context.Users.First(x => x.Id == userId);

            dynamic data = new ExpandoObject();
            data.tokens = tokens;
            data.notification = new ExpandoObject() as dynamic;
            data.notification.alert = "You have a friend request from " + user.Email;
            data.notification.android = new ExpandoObject() as dynamic;
            data.notification.android.payload = new ExpandoObject() as dynamic;
            data.notification.android.payload.userName = user.Name;
            data.notification.android.payload.userAge = user.Age;
            data.notification.android.payload.userGender = user.Gender;
            data.notification.android.payload.friendTableId = friendTableId;

            return data;
        }

    }
}
