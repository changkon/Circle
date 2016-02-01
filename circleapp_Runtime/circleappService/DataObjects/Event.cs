using Microsoft.Azure.Mobile.Server;
using System;

namespace circleappService.DataObjects
{
    /// <summary>
    /// Event domain class.
    /// </summary>

    public class Event : EntityData
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? Date { get; set; }
        public string Location { get; set; }
        //public List<string> Tags { get; set; }
    }
}