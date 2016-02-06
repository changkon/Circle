﻿using System.Web.Http;
using Microsoft.Azure.Mobile.Server.Config;
using System.Web.Http.Cors;
using System.Net.Http;
using circleappService.Models;
using System.Net;
using System.Linq;
using System;

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
        // GET api/ImportFriends
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

         // GET api/ImportFriends
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

         // GET api/SearchFriends
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
    }
}
