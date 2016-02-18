using circleappService.Models;
using System;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace circleappService.Filter
{
    public class EventAuthorizeAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (IsAuthorizedUser(actionContext, this.Roles))
            {
                base.OnAuthorization(actionContext);
            }
            else
            {
                HandleUnauthorizedRequest(actionContext);
            }
            
        }

        private bool IsAuthorizedUser(HttpActionContext actionContext, string authorizedUsers)
        {
            // Get Token from Http Request Header information
            string tokenHeader = actionContext.Request.Headers.GetValues("x-zumo-auth").FirstOrDefault();
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            JwtSecurityToken token = new JwtSecurityToken(tokenHeader);
            // get email value from token payload. NOTE: email is unique and can be used to identify user from UserId
            var email = token.Claims.Where(c => c.Type == "sub").FirstOrDefault();
            // Search for user id using email
            circleappContext context = new circleappContext();
            string userId = context.Users.Where(u => u.Email.Equals(email)).Select(u => u.Id).FirstOrDefault();

            string eventId = (string)actionContext.RequestContext.RouteData.Values["id"];

            // Check if userId is authorized to edit event details
            InvitationStatus userStatus = (InvitationStatus)context.Invitations.Where(i => i.EventId.Equals(eventId) && i.UserId.Equals(userId)).Select(i => i.Status).FirstOrDefault();

            string userStatusString = Enum.GetName(typeof(InvitationStatus), (int)userStatus);

            // accepted roles for this event
            if (authorizedUsers.Contains(userStatusString))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}