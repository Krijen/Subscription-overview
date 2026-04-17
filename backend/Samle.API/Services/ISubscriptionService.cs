using Samle.API.DTOs;

namespace Samle.API.Services;

public interface ISubscriptionService
{
    Task<IEnumerable<SubscriptionDto>> GetAllAsync(int userId);
    Task<SubscriptionDto?> GetByIdAsync(int id, int userId);
    Task<SubscriptionDto> CreateAsync(CreateSubscriptionDto dto, int userId);
    Task<SubscriptionDto?> UpdateAsync(int id, UpdateSubscriptionDto dto, int userId);
    Task<bool> DeleteAsync(int id, int userId);
}
