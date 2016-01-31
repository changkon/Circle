namespace circleappService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class setUniqueProperties2 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Users", "Email", unique: true);
            CreateIndex("dbo.Users", "PhoneNumber", unique: true);
        }
        
        public override void Down()
        {
            DropIndex("dbo.Users", new[] { "PhoneNumber" });
            DropIndex("dbo.Users", new[] { "Email" });
        }
    }
}
