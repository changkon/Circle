using Microsoft.Azure.Mobile.Server.Config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace circleappService.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [MobileAppController]
    public class RegisterController : ApiController
    {
        // GET: api/Register
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Register/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Register
        public void Post([FromBody]string value)
        {
<<<<<<< HEAD
            
=======
>>>>>>> 279a11b... commit to work on desktop instead
        }

        // PUT: api/Register/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Register/5
        public void Delete(int id)
        {
        }
    }
}
