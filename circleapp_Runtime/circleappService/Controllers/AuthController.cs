using System;
using System.IdentityModel.Tokens;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using circleappService.DataObjects;
using Microsoft.Azure.Mobile.Server.Config;
using Microsoft.Azure.Mobile.Server.Login;
using System.Web.Http.Cors;
using circleappService.Utility;
using circleappService.Models;
using System.Linq;

namespace circleappService.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [MobileAppController]
    public class AuthController : ApiController
    {
        public HttpResponseMessage Post(LoginChallenge challenge)
        {
            // return error if password is not correct
            string userId = this.IsPasswordValid(challenge.Username, challenge.Password); 
            if (userId == null)
            {
                return this.Request.CreateUnauthorizedResponse();
            }

            JwtSecurityToken token = JWTGenerator.GetAuthenticationTokenForUser(challenge.Username, this);

            return this.Request.CreateResponse(HttpStatusCode.OK, new
            {
                Token = token.RawData,
                Id = userId
            });
        }

        private string IsPasswordValid(string username, string password)
        {
            // this is where we would do checks agains a database
            circleappContext context = new circleappContext();

            var users = context.Users.Where(x => x.Email == username);

            foreach (User userAccount in users)
            {
                if (Hashing.ValidatePassword(password, userAccount.Password))
                {
                    return userAccount.Id;
                }
            }

            return null;
        }

    }
}