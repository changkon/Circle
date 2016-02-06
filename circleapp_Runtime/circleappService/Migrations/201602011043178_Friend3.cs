namespace circleappService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Friend3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Friends", "UserId", "dbo.Users");
            DropIndex("dbo.Friends", "IX_FriendIndex");
            AlterColumn("dbo.Friends", "UserId", c => c.String(nullable: false, maxLength: 128));
            AlterColumn("dbo.Friends", "FriendUserId", c => c.String(nullable: false, maxLength: 128));
            AlterColumn("dbo.Friends", "ActionUserId", c => c.String(nullable: false, maxLength: 128));
            CreateIndex("dbo.Friends", new[] { "UserId", "FriendUserId" }, unique: true, name: "IX_FriendIndex");
            AddForeignKey("dbo.Friends", "UserId", "dbo.Users", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Friends", "UserId", "dbo.Users");
            DropIndex("dbo.Friends", "IX_FriendIndex");
            AlterColumn("dbo.Friends", "ActionUserId", c => c.String(maxLength: 128));
            AlterColumn("dbo.Friends", "FriendUserId", c => c.String(maxLength: 128));
            AlterColumn("dbo.Friends", "UserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Friends", new[] { "UserId", "FriendUserId" }, unique: true, name: "IX_FriendIndex");
            AddForeignKey("dbo.Friends", "UserId", "dbo.Users", "Id");
        }
    }
}
