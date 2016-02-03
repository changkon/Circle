namespace circleappService.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeBListToken : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BlacklistTokens", "token", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.BlacklistTokens", "token");
        }
    }
}
