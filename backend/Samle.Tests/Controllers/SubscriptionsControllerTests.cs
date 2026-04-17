using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using Samle.API.Controllers;
using Samle.API.DTOs;
using Samle.API.Models;
using Samle.API.Services;

namespace Samle.Tests.Controllers;

public class SubscriptionsControllerTests
{
    private readonly ISubscriptionService _service;
    private readonly SubscriptionsController _sut;

    public SubscriptionsControllerTests()
    {
        _service = A.Fake<ISubscriptionService>();
        _sut = new SubscriptionsController(_service);
    }

    [Fact]
    public async Task GetAll_Returns200WithSubscriptions()
    {
        // Arrange
        var subscriptions = new List<SubscriptionDto>
        {
            CreateTestDto(1, "Netflix"),
            CreateTestDto(2, "Spotify")
        };
        A.CallTo(() => _service.GetAllAsync()).Returns(subscriptions);

        // Act
        var result = await _sut.GetAll();

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        var data = Assert.IsAssignableFrom<IEnumerable<SubscriptionDto>>(ok.Value);
        Assert.Equal(2, data.Count());
    }

    [Fact]
    public async Task GetById_WhenExists_Returns200()
    {
        // Arrange
        var dto = CreateTestDto(1, "Netflix");
        A.CallTo(() => _service.GetByIdAsync(1)).Returns(dto);

        // Act
        var result = await _sut.GetById(1);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(dto, ok.Value);
    }

    [Fact]
    public async Task GetById_WhenNotFound_Returns404()
    {
        // Arrange
        A.CallTo(() => _service.GetByIdAsync(99)).Returns((SubscriptionDto?)null);

        // Act
        var result = await _sut.GetById(99);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Create_Returns201WithCreatedSubscription()
    {
        // Arrange
        var createDto = new CreateSubscriptionDto(
            "Netflix", null, 179, "NOK", BillingCycle.Monthly,
            DateTime.UtcNow, null, DateTime.UtcNow.AddMonths(1), null, null);
        var created = CreateTestDto(1, "Netflix");
        A.CallTo(() => _service.CreateAsync(createDto)).Returns(created);

        // Act
        var result = await _sut.Create(createDto);

        // Assert
        var created201 = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(201, created201.StatusCode);
        Assert.Equal(created, created201.Value);
    }

    [Fact]
    public async Task Delete_WhenExists_Returns204()
    {
        // Arrange
        A.CallTo(() => _service.DeleteAsync(1)).Returns(true);

        // Act
        var result = await _sut.Delete(1);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_WhenNotFound_Returns404()
    {
        // Arrange
        A.CallTo(() => _service.DeleteAsync(99)).Returns(false);

        // Act
        var result = await _sut.Delete(99);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    private static SubscriptionDto CreateTestDto(int id, string name)
    {
        return new SubscriptionDto(
            id, name, null, 99, "NOK", BillingCycle.Monthly,
            DateTime.UtcNow.AddMonths(-1), null, DateTime.UtcNow.AddDays(10),
            null, null, true, 10, 1188);
    }
}
