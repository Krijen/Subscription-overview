namespace Samle.API.Models;

public class Subscription
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "NOK";
    public BillingCycle BillingCycle { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime NextPaymentDate { get; set; }
    public string? LogoUrl { get; set; }
    public string? Category { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
}

public enum BillingCycle
{
    Weekly,
    Monthly,
    Quarterly,
    Yearly
}
