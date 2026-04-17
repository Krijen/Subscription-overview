using Microsoft.EntityFrameworkCore;
using Samle.API.Models;

namespace Samle.API.Data;

public class SamleDbContext : DbContext
{
    public SamleDbContext(DbContextOptions<SamleDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.GoogleId);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.Property(e => e.DisplayName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.GoogleId).HasMaxLength(128);
            entity.Property(e => e.AvatarUrl).HasMaxLength(512);
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Price).HasPrecision(18, 2);
            entity.Property(e => e.Currency).HasMaxLength(3).HasDefaultValue("NOK");
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Subscriptions)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
