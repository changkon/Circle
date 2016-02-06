namespace circleappService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Friend2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Friends", "Status", c => c.Int(nullable: false));
            AddColumn("dbo.Friends", "ActionUserId", c => c.String(maxLength: 128));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Friends", "ActionUserId");
            DropColumn("dbo.Friends", "Status");
        }
    }
}
