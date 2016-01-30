using Microsoft.Azure.Mobile.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace circleappService.DataObjects
{
    /// <summary>
    /// Event domain class.
    /// </summary>

    public class Event : EntityData
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime date { get; set; }
        public string location { get; set; }
        public List<string> tags { get; set; }
    }
}