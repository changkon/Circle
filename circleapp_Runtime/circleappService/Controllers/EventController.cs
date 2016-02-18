using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using Microsoft.Azure.Mobile.Server;
using circleappService.DataObjects;
using circleappService.Models;
using System.Web.Http.Cors;
using circleappService.Filter;

namespace circleappService.Controllers
{
    /// <summary>
    /// Routing /tables/Event/{id}
    /// </summary>
    [EnableCors(origins: "*", headers: "*", methods: "*")]
#if Test
#else
    [Authorize]
#endif
    public class EventController : TableController<Event>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            circleappContext context = new circleappContext();
            base.Initialize(controllerContext);
            DomainManager = new EntityDomainManager<Event>(context, Request);
        }

        // GET tables/Event
        public IQueryable<Event> GetAllEvent()
        {
            return Query();
        }

        // GET tables/Event/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<Event> GetEvent(string id)
        {
            return Lookup(id);
        }

        [EventAuthorize(Roles="Host")]
        // PATCH tables/Event/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<Event> PatchEvent(string id, Delta<Event> patch)
        {
             return UpdateAsync(id, patch);
        }

        // POST tables/Event
        public async Task<IHttpActionResult> PostEvent(Event item)
        {
            Event current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        [EventAuthorize(Roles="Host")]
        // DELETE tables/Event/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteEvent(string id)
        {
             return DeleteAsync(id);
        }
    }
}
