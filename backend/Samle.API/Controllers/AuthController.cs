using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Samle.API.DTOs;
using Samle.API.Services;

namespace Samle.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, IConfiguration config, ILogger<AuthController> logger)
    {
        _authService = authService;
        _config = config;
        _logger = logger;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var result = await _authService.RegisterAsync(dto);
            return CreatedAtAction(nameof(Register), result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during registration");
            return StatusCode(500, new { message = "An unexpected error occurred: " + ex.Message });
        }
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during login");
            return StatusCode(500, new { message = "An unexpected error occurred: " + ex.Message });
        }
    }

    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        // RedirectUri must point to google-success, NOT google-callback.
        // The middleware owns /api/auth/google-callback (it intercepts all requests to that path).
        // If RedirectUri were the same as CallbackPath the middleware would intercept the
        // post-sign-in redirect, find no OAuth state, and throw "oauth state was missing or invalid".
        var redirectUrl = Url.Action(nameof(GoogleSuccess), "Auth", null, Request.Scheme, Request.Host.ToString());
        var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
        return Challenge(properties, "Google");
    }

    // This endpoint is called by the Google middleware after it has exchanged the OAuth code
    // and signed the user in via the Cookie scheme. We read from the cookie (not the Google
    // scheme, which only handles the raw OAuth callback) to get the claims.
    [HttpGet("google-success")]
    public async Task<IActionResult> GoogleSuccess()
    {
        var frontendUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:5173";

        try
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!result.Succeeded)
            {
                _logger.LogWarning("Google auth failed: {Error}", result.Failure?.Message);
                return Redirect($"{frontendUrl}/login?error=google_failed");
            }

            var claims = result.Principal?.Claims.ToList();
            var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var displayName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var avatarUrl = claims?.FirstOrDefault(c => c.Type == "urn:google:picture")?.Value;

            if (googleId is null || email is null)
                return Redirect($"{frontendUrl}/login?error=google_failed");

            var authResult = await _authService.GoogleLoginAsync(
                googleId, email, displayName ?? email, avatarUrl);

            var encodedEmail = Uri.EscapeDataString(authResult.Email);
            var encodedName = Uri.EscapeDataString(authResult.DisplayName);
            var encodedAvatar = Uri.EscapeDataString(authResult.AvatarUrl ?? "");

            return Redirect($"{frontendUrl}/auth/callback?token={authResult.Token}&email={encodedEmail}&displayName={encodedName}&avatarUrl={encodedAvatar}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during Google success handler");
            return Redirect($"{frontendUrl}/login?error=google_failed");
        }
    }
}
