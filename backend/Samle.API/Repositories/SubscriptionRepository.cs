using Microsoft.EntityFrameworkCore;
using Samle.API.Data;
using Samle.API.Models;

namespace Samle.API.Repositories;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly SamleDbContext _context;

    public SubscriptionRepository(SamleDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Subscription>> GetAllAsync(int userId)
    {
        return await _context.Subscriptions
            .Where(s => s.UserId == userId)
            .OrderBy(s => s.NextPaymentDate)
            .ToListAsync();
    }

    public async Task<Subscription?> GetByIdAsync(int id, int userId)
    {
        return await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
    }

    public async Task<Subscription> CreateAsync(Subscription subscription)
    {
        _context.Subscriptions.Add(subscription);
        await _context.SaveChangesAsync();
        return subscription;
    }

    public async Task<Subscription?> UpdateAsync(int id, int userId, Subscription subscription)
    {
        var existing = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        if (existing is null) return null;

        existing.Name = subscription.Name;
        existing.Description = subscription.Description;
        existing.Price = subscription.Price;
        existing.Currency = subscription.Currency;
        existing.BillingCycle = subscription.BillingCycle;
        existing.EndDate = subscription.EndDate;
        existing.NextPaymentDate = subscription.NextPaymentDate;
        existing.LogoUrl = subscription.LogoUrl;
        existing.Category = subscription.Category;
        existing.IsActive = subscription.IsActive;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        if (subscription is null) return false;

        _context.Subscriptions.Remove(subscription);
        await _context.SaveChangesAsync();
        return true;
    }
}
