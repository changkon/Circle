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
        // GET api/CircleCustom/GetAllUserCircles/{id}
        public HttpResponseMessage GetAllUserCircles()
        {
            var parameters = this.Request.GetQueryNameValuePairs();
            if (parameters.Count() > 0)
            {
                var userId = parameters.ElementAt(0).Value;
                // Find all circle id from invitation table
                circleappContext context = new circleappContext();
                var userCircles = context.CircleInvitations.Where(i => i.UserId == userId);
                IQueryable<Circle> circles = context.Circles.Where(c => userCircles.Any(uc => uc.CircleId == c.Id));
                return Request.CreateResponse(HttpStatusCode.OK, circles);
            }
            else
            {
                return this.Request.CreateResponse(HttpStatusCode.BadRequest, new { });
            }
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
                var userCircles = context.CircleInvitations.Where(i => i.CircleId == circleId);
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

    }
}
