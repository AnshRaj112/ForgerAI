package ai.forger.enterprise.security;

import ai.forger.enterprise.config.EnterpriseProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/** Issues and parses HS256 JWTs with subject and role claims for stateless API access. */
@Service
@RequiredArgsConstructor
public class JwtService {

  private final EnterpriseProperties enterpriseProperties;
  private javax.crypto.SecretKey key;

  @PostConstruct
  void init() {
    String secret = enterpriseProperties.getSecurity().getJwt().getSecret();
    if (!StringUtils.hasText(secret)) {
      throw new IllegalStateException("enterprise.security.jwt.secret must be configured");
    }
    byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
    if (bytes.length < 32) {
      throw new IllegalStateException(
          "enterprise.security.jwt.secret must be at least 32 bytes (256 bits) for HS256");
    }
    this.key = Keys.hmacShaKeyFor(bytes);
  }

  public String generateToken(UserDetails user) {
    long expMs = enterpriseProperties.getSecurity().getJwt().getExpirationMs();
    Date now = new Date();
    Date exp = new Date(now.getTime() + expMs);
    List<String> authorities =
        user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
    return Jwts.builder()
        .subject(user.getUsername())
        .issuedAt(now)
        .expiration(exp)
        .claim("roles", authorities)
        .signWith(key)
        .compact();
  }

  public UsernamePasswordAuthenticationToken parseToken(String bearerToken) {
    String token = bearerToken.substring("Bearer ".length()).trim();
    Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    String subject = claims.getSubject();
    @SuppressWarnings("unchecked")
    List<String> roles = claims.get("roles", List.class);
    List<GrantedAuthority> authorities =
        roles == null
            ? List.of()
            : roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    UserDetails principal =
        User.withUsername(subject).password("{noop}").authorities(authorities).build();
    return new UsernamePasswordAuthenticationToken(principal, token, authorities);
  }

  public long expirationSeconds() {
    return enterpriseProperties.getSecurity().getJwt().getExpirationMs() / 1000;
  }
}
