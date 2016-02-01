using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.OData;
using Microsoft.Azure.Mobile.Server;
using circleappService.DataObjects;
using circleappService.Models;
using System.Web.Http.Cors;

namespace circleappService.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
#if Test
#else
    [Authorize]
#endif
    public class FriendController : TableController<Friend>
    {
        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);
            circleappContext context = new circleappContext();
            DomainManager = new EntityDomainManager<Friend>(context, Request);
        }

        // GET tables/Friend
        public IQueryable<Friend> GetAllTodoItems()
        {
            return Query();
        }

        // GET tables/Friend/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public SingleResult<Friend> GetTodoItem(string id)
        {
            return Lookup(id);
        }

        // PATCH tables/Friend/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task<Friend> PatchTodoItem(string id, Delta<Friend> patch)
        {
            return UpdateAsync(id, patch);
        }

        // POST tables/Friend
        public async Task<IHttpActionResult> PostTodoItem(Friend item)
        {
            Friend current = await InsertAsync(item);
            return CreatedAtRoute("Tables", new { id = current.Id }, current);
        }

        // DELETE tables/Friend/48D68C86-6EA6-4C25-AA33-223FC9A27959
        public Task DeleteTodoItem(string id)
        {
            return DeleteAsync(id);
        }
    }
}