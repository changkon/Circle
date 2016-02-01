namespace circleappService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DateAllowNullableEvent : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Events", "Date", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Events", "Date", c => c.DateTime(nullable: false));
        }
    }
}
