using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using Microsoft.Azure.Mobile.Server;
using circleappService.DataObjects;
using circleappService.Models;
using Microsoft.Azure.Mobile.Server.Config;
using System.Web.Http.Cors;

namespace circleappService.Controllers
{
#if Test
#else
    [Authorize]
#endif
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [MobileAppController]
    public class CircleController : TableController<Circle>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            circleappContext context = new circleappContext();
            DomainManager = new EntityDomainManager<Circle>(context, Request);
        }

        // GET tables/Circle
        public IQueryable<Circle> GetAllCircles()
        {
            return Query();
        }

        // GET tables/Circle/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<Circle> GetCircle(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/Circle/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<Circle> PatchCircle(string id, Delta<Circle> patch)
        {
            return UpdateAsync(id, patch);
        }

        // POST tables/Circle
        public async Task<IHttpActionResult> PostCircle(Circle item)
        {
            Circle current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/Circle/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteCircle(string id)
        {
            return DeleteAsync(id);
        }
    }
}
