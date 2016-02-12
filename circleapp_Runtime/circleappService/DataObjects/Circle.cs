using Microsoft.Azure.Mobile.Server;
using System.ComponentModel.DataAnnotations.Schema;

namespace circleappService.DataObjects
{
    public class Circle : EntityData
    {

        public string Name { get; set; }

    }
}