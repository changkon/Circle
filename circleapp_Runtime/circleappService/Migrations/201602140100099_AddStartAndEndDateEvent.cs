namespace circleappService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddStartAndEndDateEvent : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "StartDate", c => c.DateTime());
            AddColumn("dbo.Events", "EndDate", c => c.DateTime());
            DropColumn("dbo.Events", "Date");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Events", "Date", c => c.DateTime());
            DropColumn("dbo.Events", "EndDate");
            DropColumn("dbo.Events", "StartDate");
        }
    }
}
