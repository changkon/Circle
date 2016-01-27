using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(circleappService.Startup))]

namespace circleappService
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureMobileApp(app);
        }
    }
}