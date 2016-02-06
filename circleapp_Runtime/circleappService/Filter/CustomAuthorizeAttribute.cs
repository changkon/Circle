using circleappService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace circleappService.Filter
{
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {

        public override void OnAuthorization(HttpActionContext actionContext)
        {

            if (isTokenBlacklist(actionContext))
            {
                HandleUnauthorizedRequest(actionContext);
            }
            else
            {
                base.OnAuthorization(actionContext);
            }
        }


        private bool isTokenBlacklist(HttpActionContext actionContext)
        {
            //check if the request has the authentication headers value
            IEnumerable<string> values;
            if (actionContext.Request.Headers.TryGetValues("x-zumo-auth", out values))
            {
                circleappContext db = new circleappContext();
                string query = "SELECT * FROM dbo.BlacklistTokens WHERE token = '" + values.First()  + "'";
                var tokens = db.BlackLists.SqlQuery(query).ToList();

                if (tokens.Any()) {
                    return true;
                }
                else
                {
                    return false;
                }            
            }
            else
            {
                return true;
            }

        }

    }
}