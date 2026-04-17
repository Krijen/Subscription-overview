using FakeItEasy;
using Samle.API.DTOs;
using Samle.API.Models;
using Samle.API.Repositories;
using Samle.API.Services;

namespace Samle.Tests.Services;

public class SubscriptionServiceTests
{
    private readonly ISubscriptionRepository _repository;
    private readonly SubscriptionService _sut;

    public SubscriptionServiceTests()
    {
        _repository = A.Fake<ISubscriptionRepository>();
        _sut = new SubscriptionService(_repository);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllSubscriptions()
    {
        // Arrange
        var subscriptions = new List<Subscription>
        {
            CreateTestSubscription(1, "Netflix"),
            CreateTestSubscription(2, "Spotify")
        };
        A.CallTo(() => _repository.GetAllAsync()).Returns(subscriptions);

        // Act
        var result = await _sut.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count());
        A.CallTo(() => _repository.GetAllAsync()).MustHaveHappenedOnceExactly();
    }

    [Fact]
    public async Task GetByIdAsync_WhenExists_ReturnsSubscription()
    {
        // Arrange
        var subscription = CreateTestSubscription(1, "Netflix");
        A.CallTo(() => _repository.GetByIdAsync(1)).Returns(subscription);

        // Act
        var result = await _sut.GetByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Netflix", result.Name);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ReturnsNull()
    {
        // Arrange
        A.CallTo(() => _repository.GetByIdAsync(99)).Returns((Subscription?)null);

        // Act
        var result = await _sut.GetByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_CreatesAndReturnsSubscription()
    {
        // Arrange
        var dto = new CreateSubscriptionDto(
            "Netflix",
            "Streaming service",
            179,
            "NOK",
            BillingCycle.Monthly,
            DateTime.UtcNow,
            null,
            DateTime.UtcNow.AddMonths(1),
            null,
            "Entertainment"
        );
        var created = CreateTestSubscription(1, "Netflix");
        A.CallTo(() => _repository.CreateAsync(A<Subscription>._)).Returns(created);

        // Act
        var result = await _sut.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Netflix", result.Name);
        A.CallTo(() => _repository.CreateAsync(A<Subscription>._)).MustHaveHappenedOnceExactly();
    }

    [Fact]
    public async Task DeleteAsync_WhenExists_ReturnsTrue()
    {
        // Arrange
        A.CallTo(() => _repository.DeleteAsync(1)).Returns(true);

        // Act
        var result = await _sut.DeleteAsync(1);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task DeleteAsync_WhenNotFound_ReturnsFalse()
    {
        // Arrange
        A.CallTo(() => _repository.DeleteAsync(99)).Returns(false);

        // Act
        var result = await _sut.DeleteAsync(99);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(BillingCycle.Monthly, 100, 1200)]
    [InlineData(BillingCycle.Yearly, 1000, 1000)]
    [InlineData(BillingCycle.Weekly, 50, 2600)]
    [InlineData(BillingCycle.Quarterly, 300, 1200)]
    public async Task GetAllAsync_CalculatesYearlyEquivalentCorrectly(
        BillingCycle cycle, decimal price, decimal expectedYearly)
    {
        // Arrange
        var subscription = CreateTestSubscription(1, "Test", price, cycle);
        A.CallTo(() => _repository.GetAllAsync()).Returns(new List<Subscription> { subscription });

        // Act
        var result = (await _sut.GetAllAsync()).First();

        // Assert
        Assert.Equal(expectedYearly, result.YearlyEquivalent);
    }

    private static Subscription CreateTestSubscription(
        int id, string name, decimal price = 99, BillingCycle cycle = BillingCycle.Monthly)
    {
        return new Subscription
        {
            Id = id,
            Name = name,
            Price = price,
            Currency = "NOK",
            BillingCycle = cycle,
            StartDate = DateTime.UtcNow.AddMonths(-1),
            NextPaymentDate = DateTime.UtcNow.AddDays(10),
            IsActive = true
        };
    }
}
