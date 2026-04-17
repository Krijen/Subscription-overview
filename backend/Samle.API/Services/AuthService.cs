using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Samle.API.Data;
using Samle.API.DTOs;
using Samle.API.Models;

namespace Samle.API.Services;

public class AuthService : IAuthService
{
    private readonly SamleDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(SamleDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email.ToLower()))
            throw new InvalidOperationException("An account with that email already exists.");

        var user = new User
        {
            Email = dto.Email.ToLower().Trim(),
            DisplayName = dto.DisplayName.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new AuthResponseDto(
            GenerateTokenForUser(user.Id, user.Email, user.DisplayName),
            user.Email, user.DisplayName, null);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower());
        if (user is null || user.PasswordHash is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return new AuthResponseDto(
            GenerateTokenForUser(user.Id, user.Email, user.DisplayName),
            user.Email, user.DisplayName, user.AvatarUrl);
    }

    public async Task<AuthResponseDto> GoogleLoginAsync(string googleId, string email, string displayName, string? avatarUrl)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId)
                ?? await _context.Users.FirstOrDefaultAsync(u => u.Email == email.ToLower());

        if (user is null)
        {
            user = new User
            {
                Email = email.ToLower(),
                DisplayName = displayName,
                GoogleId = googleId,
                AvatarUrl = avatarUrl
            };
            _context.Users.Add(user);
        }
        else
        {
            user.GoogleId ??= googleId;
            user.AvatarUrl = avatarUrl;
        }

        await _context.SaveChangesAsync();

        return new AuthResponseDto(
            GenerateTokenForUser(user.Id, user.Email, user.DisplayName),
            user.Email, user.DisplayName, user.AvatarUrl);
    }

    public string GenerateTokenForUser(int userId, string email, string displayName)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Secret"] ?? throw new InvalidOperationException("JWT secret not configured.")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Name, displayName),
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
