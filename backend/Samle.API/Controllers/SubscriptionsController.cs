using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Samle.API.DTOs;
using Samle.API.Services;

namespace Samle.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class SubscriptionsController : ControllerBase
{
    private readonly ISubscriptionService _service;

    public SubscriptionsController(ISubscriptionService service)
    {
        _service = service;
    }

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SubscriptionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var subscriptions = await _service.GetAllAsync(UserId);
        return Ok(subscriptions);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(SubscriptionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var subscription = await _service.GetByIdAsync(id, UserId);
        return subscription is null ? NotFound() : Ok(subscription);
    }

    [HttpPost]
    [ProducesResponseType(typeof(SubscriptionDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateSubscriptionDto dto)
    {
        var created = await _service.CreateAsync(dto, UserId);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(SubscriptionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSubscriptionDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto, UserId);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id, UserId);
        return deleted ? NoContent() : NotFound();
    }
}
