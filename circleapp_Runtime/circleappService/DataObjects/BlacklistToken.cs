using Microsoft.Azure.Mobile.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace circleappService.DataObjects
{
    public class BlacklistToken : EntityData
    {
        public string token { get; set; }
        public DateTime expireTime { get; set; }
    }
}