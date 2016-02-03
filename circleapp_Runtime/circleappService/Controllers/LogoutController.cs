using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using circleappService.DataObjects;
using circleappService.Models;
using System.IdentityModel.Tokens;
using System.Web.Http.Cors;
using Microsoft.Azure.Mobile.Server.Config;
using System.Security.Claims;
using System.Data.Entity.Validation;
using System.Text;

namespace circleappService.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [MobileAppController]
    public class LogoutController : ApiController
    {
        private circleappContext db = new circleappContext();

        public string Get()
        {
            return DateTime.Now.ToString(); ;
        }

        // POST: api/Logout
        public IHttpActionResult PostBlacklistToken(BlacklistToken token)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            JwtSecurityToken newToken = new JwtSecurityToken(token.token);
            foreach (Claim claim in newToken.Claims)
            {
                if (claim.Type == "exp") {
                    
                    token.expireTime = UnixTimeStampToDateTime(Convert.ToDouble(claim.Value));
                    token.Id = Guid.NewGuid().ToString();
                    db.BlackLists.Add(token);
                }
            }
            JwtPayload result = newToken.Payload;


            StringBuilder builder = new StringBuilder();
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    foreach (var ve in eve.ValidationErrors)
                    {
                        builder.AppendLine("Property: " + ve.PropertyName + " Error: " + ve.ErrorMessage);
                    }
                }
                return Content(System.Net.HttpStatusCode.Accepted, builder.ToString());
            }

            return Content(System.Net.HttpStatusCode.Accepted, token.expireTime);
        }

        public  DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }

    }
}