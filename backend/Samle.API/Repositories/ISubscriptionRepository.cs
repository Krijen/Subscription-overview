using Samle.API.Models;

namespace Samle.API.Repositories;

public interface ISubscriptionRepository
{
    Task<IEnumerable<Subscription>> GetAllAsync(int userId);
    Task<Subscription?> GetByIdAsync(int id, int userId);
    Task<Subscription> CreateAsync(Subscription subscription);
    Task<Subscription?> UpdateAsync(int id, int userId, Subscription subscription);
    Task<bool> DeleteAsync(int id, int userId);
}
