﻿using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using Microsoft.Azure.Mobile.Server;
using Microsoft.Azure.Mobile.Server.Tables;
using circleappService.DataObjects;

namespace circleappService.Models
{
    public class circleappContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to alter your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx

        private const string connectionStringName = "Name=MS_TableConnectionString";

        public circleappContext() : base(connectionStringName)
        {
        } 

        public DbSet<TodoItem> TodoItems { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Add(
                new AttributeToColumnAnnotationConvention<TableColumnAttribute, string>(
                    "ServiceTableColumn", (property, attributes) => attributes.Single().ColumnType.ToString()));

            // configure Event object properties
            modelBuilder.Entity<Event>()
                .Property(e => e.Title)
                .IsRequired();

            modelBuilder.Entity<Event>()
                .Property(e => e.Description)
                .IsRequired();

            // Configure Invitation object properties
            modelBuilder.Entity<Invitation>()
                .Property(i => i.Status)
                .IsRequired();

            modelBuilder.Entity<Invitation>()
                .Property(i => i.UserId)
                .HasColumnType("NVARCHAR")
                .HasMaxLength(128)
                .IsRequired();

            modelBuilder.Entity<Invitation>()
                .Property(i => i.EventId)
                .HasColumnType("NVARCHAR")
                .HasMaxLength(128)
                .IsRequired();

            modelBuilder.Entity<Friend>().Property(e => e.UserId).HasColumnType("NVARCHAR").HasMaxLength(128).IsRequired();
            modelBuilder.Entity<Friend>().Property(e => e.FriendUserId).HasColumnType("NVARCHAR").HasMaxLength(128).IsRequired();
            modelBuilder.Entity<Friend>().Property(e => e.ActionUserId).HasColumnType("NVARCHAR").HasMaxLength(128).IsRequired();
            modelBuilder.Entity<Friend>().Property(e => e.Status).IsRequired();

            modelBuilder.Entity<UserTokenPair>().Property(e => e.UserId).HasColumnType("NVARCHAR").HasMaxLength(128).IsRequired();
            modelBuilder.Entity<UserTokenPair>().Property(e => e.DeviceToken).HasColumnType("NVARCHAR").HasMaxLength(512).IsRequired();
            modelBuilder.Entity<Circle>().Property(e => e.Name).HasColumnType("NVARCHAR").HasMaxLength(128).IsRequired();
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<BlacklistToken> BlackLists { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Invitation> Invitations { get; set; }
        public DbSet<UserTokenPair> UserTokenPairs { get; set; }
        public DbSet<Circle> Circles { get; set; }
    }

}
