using System.Web.Http;
using Microsoft.Azure.Mobile.Server.Config;
using System.Web.Http.Cors;
using System.Net.Http;
using circleappService.Models;
using System.Net;
using System.Linq;
using System;
using System.IdentityModel.Tokens;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Dynamic;

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

        // GET api/ImportFriends/GetAllFriends
        public HttpResponseMessage GetAllFriends()
         {
             var parameters = this.Request.GetQueryNameValuePairs();
             if (parameters.Count() > 0)
             {
                 circleappContext ctx = new circleappContext();
                 var userId = parameters.ElementAt(0).Value;
                 var friendIds1 = ctx.Friends.Where(x => x.UserId == userId).Select(u => u.FriendUserId); ;
                 var friendIds2 = ctx.Friends.Where(x => x.FriendUserId == userId).Select(u => u.UserId);
                 var friendUsers = ctx.Users.Where(x => friendIds1.Contains(x.Id) || friendIds2.Contains(x.Id));

                 return this.Request.CreateResponse(HttpStatusCode.OK, new
                 {
                     Users = friendUsers
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
                string id = parameters.ElementAt(0).Value;
                string friendId = parameters.ElementAt(1).Value;

                dynamic data = new ExpandoObject();
                data.tokens = new List<string>() { "fut4H0rRDjo:APA91bGxfCp-tuPVkb3EG2_IxkaQRXbIkbUOMXG4yGW4TgATpdb6_DfoOhx8XJmyTAQ4FYupNZVLpXeb7AOTingss8IkUpRG5a99waceXE-322RaoTZQWMutIymqllpbzoetxrMOcSSS" };
                data.notification = new ExpandoObject() as dynamic;
                data.notification.alert = "You have a friend request";

                string json = Newtonsoft.Json.JsonConvert.SerializeObject(data);
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://push.ionic.io/api/v1/push");
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Add("X-Ionic-Application-Id", "0366b4a3");
                    var keyBase64 = "Basic " + Base64Encode("50747f5c2a0ba72af8fa7dd15705710dad02d8611e288dc5");
                    client.DefaultRequestHeaders.Add("Authorization", keyBase64);
                    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "push");
                    request.Content = new StringContent(json, Encoding.UTF8, "application/json");
                    var response = client.SendAsync(request).Result;
                }

                return this.Request.CreateResponse(HttpStatusCode.OK, new { });
            }
            else
            {
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, new { });
            }
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

    }
}
