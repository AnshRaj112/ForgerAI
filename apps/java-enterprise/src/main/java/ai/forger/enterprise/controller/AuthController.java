package ai.forger.enterprise.controller;

import ai.forger.enterprise.dto.request.LoginRequest;
import ai.forger.enterprise.dto.response.TokenResponse;
import ai.forger.enterprise.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Issues JWT access tokens for configured bootstrap users (dev) or production admin credentials. */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final UserDetailsService userDetailsService;
  private final JwtService jwtService;

  @PostMapping("/login")
  public TokenResponse login(@Valid @RequestBody LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.username(), request.password()));
    UserDetails user = userDetailsService.loadUserByUsername(request.username());
    String token = jwtService.generateToken(user);
    return new TokenResponse(token, "Bearer", jwtService.expirationSeconds());
  }
}
