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
    public class DeviceTokenController : TableController<UserTokenPair>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            circleappContext context = new circleappContext();
            DomainManager = new EntityDomainManager<UserTokenPair>(context, Request);
        }

        // GET tables/DeviceToken
        public IQueryable<UserTokenPair> GetAllPairs()
        {
            return Query();
        }

        // GET tables/DeviceToken/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<UserTokenPair> GetUserTokenPair(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/DeviceToken/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<UserTokenPair> PatchUserTokenPair(string id, Delta<UserTokenPair> patch)
        {
            return UpdateAsync(id, patch);
        }

        // POST tables/DeviceToken
        public async Task<IHttpActionResult> PostUserTokenPair(UserTokenPair item)
        {
            UserTokenPair current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/DeviceToken/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteUserTokenPair(string id)
        {
            return DeleteAsync(id);
        }
    }
}
