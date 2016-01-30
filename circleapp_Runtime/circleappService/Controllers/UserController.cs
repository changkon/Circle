using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using Microsoft.Azure.Mobile.Server;
using circleappService.DataObjects;
using circleappService.Models;
using System.Web.Http.Cors;
using Microsoft.Azure.Mobile.Server.Config;

namespace circleappService.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [MobileAppController]
    public class UserController : TableController<User>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            circleappContext context = new circleappContext();
            DomainManager = new EntityDomainManager<User>(context, Request);
        }


        // POST tables/User
        public async Task<IHttpActionResult> PostUser(User item)
        {
            User current = await InsertAsync(item);
            return Ok();
        }

    }
}
