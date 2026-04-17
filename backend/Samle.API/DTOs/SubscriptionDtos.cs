using Samle.API.Models;

namespace Samle.API.DTOs;

public record SubscriptionDto(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    string Currency,
    BillingCycle BillingCycle,
    DateTime StartDate,
    DateTime? EndDate,
    DateTime NextPaymentDate,
    string? LogoUrl,
    string? Category,
    bool IsActive,
    int DaysUntilNextPayment,
    decimal YearlyEquivalent
);

public record CreateSubscriptionDto(
    string Name,
    string? Description,
    decimal Price,
    string Currency,
    BillingCycle BillingCycle,
    DateTime StartDate,
    DateTime? EndDate,
    DateTime NextPaymentDate,
    string? LogoUrl,
    string? Category
);

public record UpdateSubscriptionDto(
    string Name,
    string? Description,
    decimal Price,
    string Currency,
    BillingCycle BillingCycle,
    DateTime? EndDate,
    DateTime NextPaymentDate,
    string? LogoUrl,
    string? Category,
    bool IsActive
);
