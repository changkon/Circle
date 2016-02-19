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
using circleappService.DataObjects;
using System.IdentityModel.Tokens;

namespace circleappService.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [MobileAppController]
#if Test
#else
        [Authorize]
#endif
    public class CircleCustomController : ApiController
    {
        // GET api/CircleCustom/GetAllUserCircles
        public HttpResponseMessage GetAllUserCircles(HttpRequestMessage request)
        {
            var token = request.Headers.GetValues("x-zumo-auth").FirstOrDefault();
            JwtSecurityToken newToken = new JwtSecurityToken(token);
            var email = newToken.Claims.Where(c => c.Type == "sub").FirstOrDefault().Value;
            circleappContext context = new circleappContext();
            var userId = context.Users.Where(u => u.Email == email).FirstOrDefault().Id;

            // Find all circle id from invitation table
            var userCircles = context.CircleInvitations.Where(i => i.UserId == userId);
            IQueryable<Circle> circles = context.Circles.Where(c => userCircles.Any(uc => uc.CircleId == c.Id && uc.Status == 1));
            IQueryable<Circle> pendingCircles = context.Circles.Where(c => userCircles.Any(uc => uc.CircleId == c.Id && uc.Status == 0));
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                Circles = circles,
                PendingCircles = pendingCircles
            });
        }

        // GET api/CircleCustom/GetAllUsersInACircles/{circleId}
        public HttpResponseMessage GetAllUsersInACircles()
        {
            var parameters = this.Request.GetQueryNameValuePairs();
            if (parameters.Count() > 0)
            {
                var circleId = parameters.ElementAt(0).Value;
                // Find all circle id from invitation table
                circleappContext context = new circleappContext();
                var userCircles = context.CircleInvitations.Where(i => i.CircleId == circleId && i.Status == 1);
                IQueryable<User> users = context.Users.Where(u => userCircles.Any(uc => uc.UserId == u.Id));
                return Request.CreateResponse(HttpStatusCode.OK, users);
            }
            else
            {
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, new { });
            }
        }


        // POST api/CircleCustom/PostCircle
        public HttpResponseMessage PostCircle(HttpRequestMessage request) //request has form {"Name":"MyCircle", "UserId":"12345"}
        {
            circleappContext context = new circleappContext();

            var content = request.Content;
            string jsonContent = content.ReadAsStringAsync().Result;
            dynamic obj = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonContent);

            Circle c = new Circle();
            c.Name = obj.Name;
            c.Id = Guid.NewGuid().ToString();
            var circle = context.Circles.Add(c);

            CircleInvitation invitation = new CircleInvitation();
            invitation.Status = 1; //the creator should already be going
            invitation.UserId = obj.UserId;
            invitation.CircleId = circle.Id;
            invitation.Id = Guid.NewGuid().ToString();
            context.CircleInvitations.Add(invitation);

            context.SaveChanges();

            return Request.CreateResponse(HttpStatusCode.OK, invitation);
        }

        // POST api/CircleCustom/PostInviteToCircle
        public HttpResponseMessage PostInviteToCircle(HttpRequestMessage request) //request has form {"CircleId":"xxxx", "FriendId":"12345"}
        {
            circleappContext context = new circleappContext();

            var content = request.Content;
            string jsonContent = content.ReadAsStringAsync().Result;
            dynamic obj = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonContent);

            CircleInvitation invitation = new CircleInvitation();
            invitation.UserId = obj.FriendId;
            invitation.CircleId = obj.CircleId;
            invitation.Id = Guid.NewGuid().ToString();
            invitation.Status = 0;
            context.CircleInvitations.Add(invitation);

            context.SaveChanges();

            return Request.CreateResponse(HttpStatusCode.OK, invitation);
        }

        // POST api/CircleCustom/PostAcceptCircleInvitation
        public HttpResponseMessage PostAcceptCircleInvitation(HttpRequestMessage request) //request has form {"CircleId":"xxxx"}
        {
            var content = request.Content;
            string jsonContent = content.ReadAsStringAsync().Result;
            dynamic obj = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonContent);
            string circleId = obj.CircleId;
            var token = request.Headers.GetValues("x-zumo-auth").FirstOrDefault();
            JwtSecurityToken newToken = new JwtSecurityToken(token);
            var email = newToken.Claims.Where(c => c.Type == "sub").FirstOrDefault().Value;
            circleappContext context = new circleappContext();
            var userId = context.Users.Where(u => u.Email == email).FirstOrDefault().Id;

            var circleInvitation = context.CircleInvitations.Where(ci => ci.CircleId == circleId && ci.UserId == userId).FirstOrDefault();
            circleInvitation.Status = 1;

            context.SaveChanges();

            return Request.CreateResponse(HttpStatusCode.OK, circleInvitation);
        }

    }
}
