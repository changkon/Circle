using System.Web.Http;
using Microsoft.Azure.Mobile.Server.Config;
using System.Net.Http;
using circleappService.Models;
using System.Linq;
using circleappService.DataObjects;
using System.Net;
using System.Web.Http.Cors;

namespace circleappService.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [MobileAppController]
#if Test
#else
    [Authorize]
#endif
    public class UserEventsController : ApiController
    {
        // GET api/UserEvents
        public string Get()
        {
            return "Hello from custom controller!";
        }

        // GET api/UserEvents/GetAllUserEvents/{id}
        public HttpResponseMessage GetAllUserEvents(string id)
        {
            // Find all event id from invitation table
            circleappContext context = new circleappContext();
            var userEvents = context.Invitations.Where(i => i.UserId == id);
            IQueryable<Event> events = context.Events.Where(e => userEvents.Any(ue => ue.EventId == e.Id));
            return Request.CreateResponse(HttpStatusCode.OK, events);
        }

        // GET api/UserEvents/GetAllUserHostedEvents/{id}
        public HttpResponseMessage GetAllUserHostedEvents(string id)
        {
            // Find all event id from invitation table
            circleappContext context = new circleappContext();
            var userEvents = context.Invitations.Where(i => i.UserId == id && i.Status == 0);
            IQueryable<Event> events = context.Events.Where(e => userEvents.Any(ue => ue.EventId == e.Id));
            return Request.CreateResponse(HttpStatusCode.OK, events);
        }

        // GET api/UserEvents/GetAllUserAttendingEvents/{id}
        public HttpResponseMessage GetAllUserAttendingEvents(string id)
        {
            // Find all event id from invitation table
            circleappContext context = new circleappContext();
            var userEvents = context.Invitations.Where(i => i.UserId == id && i.Status == 1);
            IQueryable<Event> events = context.Events.Where(e => userEvents.Any(ue => ue.EventId == e.Id));
            return Request.CreateResponse(HttpStatusCode.OK, events);
        }
    }
}
