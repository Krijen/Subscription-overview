using Samle.API.DTOs;

namespace Samle.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> GoogleLoginAsync(string googleId, string email, string displayName, string? avatarUrl);
    string GenerateTokenForUser(int userId, string email, string displayName);
}
