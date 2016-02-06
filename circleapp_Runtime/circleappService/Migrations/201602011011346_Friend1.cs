namespace circleappService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Friend1 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Friends", "userId", c => c.String(maxLength: 128));
            AlterColumn("dbo.Friends", "friendUserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Friends", new[] { "userId", "friendUserId" }, unique: true, name: "IX_FriendIndex");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Friends", "IX_FriendIndex");
            AlterColumn("dbo.Friends", "friendUserId", c => c.String());
            AlterColumn("dbo.Friends", "userId", c => c.String());
        }
    }
}
