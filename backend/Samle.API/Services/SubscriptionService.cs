using Samle.API.DTOs;
using Samle.API.Models;
using Samle.API.Repositories;

namespace Samle.API.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly ISubscriptionRepository _repository;

    public SubscriptionService(ISubscriptionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<SubscriptionDto>> GetAllAsync(int userId)
    {
        var subscriptions = await _repository.GetAllAsync(userId);
        return subscriptions.Select(MapToDto);
    }

    public async Task<SubscriptionDto?> GetByIdAsync(int id, int userId)
    {
        var subscription = await _repository.GetByIdAsync(id, userId);
        return subscription is null ? null : MapToDto(subscription);
    }

    public async Task<SubscriptionDto> CreateAsync(CreateSubscriptionDto dto, int userId)
    {
        var subscription = new Subscription
        {
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Currency = dto.Currency,
            BillingCycle = dto.BillingCycle,
            StartDate = Utc(dto.StartDate),
            EndDate = dto.EndDate.HasValue ? Utc(dto.EndDate.Value) : null,
            NextPaymentDate = Utc(dto.NextPaymentDate),
            LogoUrl = dto.LogoUrl,
            Category = dto.Category
        };

        var created = await _repository.CreateAsync(subscription);
        return MapToDto(created);
    }

    public async Task<SubscriptionDto?> UpdateAsync(int id, UpdateSubscriptionDto dto, int userId)
    {
        var subscription = new Subscription
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Currency = dto.Currency,
            BillingCycle = dto.BillingCycle,
            EndDate = dto.EndDate.HasValue ? Utc(dto.EndDate.Value) : null,
            NextPaymentDate = Utc(dto.NextPaymentDate),
            LogoUrl = dto.LogoUrl,
            Category = dto.Category,
            IsActive = dto.IsActive
        };

        var updated = await _repository.UpdateAsync(id, userId, subscription);
        return updated is null ? null : MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        return await _repository.DeleteAsync(id, userId);
    }

    private static DateTime Utc(DateTime dt) => DateTime.SpecifyKind(dt, DateTimeKind.Utc);

    private static SubscriptionDto MapToDto(Subscription s)
    {
        var daysUntilNextPayment = (s.NextPaymentDate.Date - DateTime.UtcNow.Date).Days;

        var yearlyEquivalent = s.BillingCycle switch
        {
            BillingCycle.Weekly => s.Price * 52,
            BillingCycle.Monthly => s.Price * 12,
            BillingCycle.Quarterly => s.Price * 4,
            BillingCycle.Yearly => s.Price,
            _ => s.Price * 12
        };

        return new SubscriptionDto(
            s.Id, s.Name, s.Description, s.Price, s.Currency, s.BillingCycle,
            s.StartDate, s.EndDate, s.NextPaymentDate, s.LogoUrl, s.Category,
            s.IsActive, daysUntilNextPayment, yearlyEquivalent
        );
    }
}
