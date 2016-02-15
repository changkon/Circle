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
    public class CircleCircleInvitationController : TableController<CircleInvitation>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            circleappContext context = new circleappContext();
            DomainManager = new EntityDomainManager<CircleInvitation>(context, Request);
        }

        // GET tables/CircleInvitation
        public IQueryable<CircleInvitation> GetAllCircleInvitation()
        {
            return Query(); 
        }

        // GET tables/CircleInvitation/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<CircleInvitation> GetCircleInvitation(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/CircleInvitation/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<CircleInvitation> PatchCircleInvitation(string id, Delta<CircleInvitation> patch)
        {
             return UpdateAsync(id, patch);
        }

        // POST tables/CircleInvitation
        public async Task<IHttpActionResult> PostCircleInvitation(CircleInvitation item)
        {
            CircleInvitation current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/CircleInvitation/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteCircleInvitation(string id)
        {
             return DeleteAsync(id);
        }
    }
}
