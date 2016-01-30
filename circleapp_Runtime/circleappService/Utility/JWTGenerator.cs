using Microsoft.Azure.Mobile.Server.Login;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Http;

namespace circleappService.Utility
{
    public class JWTGenerator
    {
        public static JwtSecurityToken GetAuthenticationTokenForUser(string username, ApiController controller)
        {
            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username)
            };

            var signingKey = GetSigningKey(controller);
            var audience = GetSiteUrl(controller); // audience must match the url of the site
            var issuer = GetSiteUrl(controller); // audience must match the url of the site 

            JwtSecurityToken token = AppServiceLoginHandler.CreateToken(
                claims,
                signingKey,
                audience,
                issuer,
                TimeSpan.FromHours(24)
                );

            return token;
        }

        private static string GetSiteUrl(ApiController controller)
        {
            var settings = controller.Configuration.GetMobileAppSettingsProvider().GetMobileAppSettings();

            if (string.IsNullOrEmpty(settings.HostName))
            {
                return "http://localhost";
            }
            else
            {
                return "https://" + settings.HostName + "/";
            }
        }

        private static string GetSigningKey(ApiController controller)
        {
            var settings = controller.Configuration.GetMobileAppSettingsProvider().GetMobileAppSettings();

            if (string.IsNullOrEmpty(settings.HostName))
            {
                // this key is for debuggint and testing purposes only
                // this key should match the one supplied in Startup.MobileApp.cs
                return "GfYVqdtZUJQfghRiaonAeRQRDjytRi47";
            }
            else
            {
                return Environment.GetEnvironmentVariable("WEBSITE_AUTH_SIGNING_KEY");
            }
        }
    }
}
