namespace Samle.API.DTOs;

public record RegisterDto(
    string Email,
    string DisplayName,
    string Password
);

public record LoginDto(
    string Email,
    string Password
);

public record AuthResponseDto(
    string Token,
    string Email,
    string DisplayName,
    string? AvatarUrl
);
