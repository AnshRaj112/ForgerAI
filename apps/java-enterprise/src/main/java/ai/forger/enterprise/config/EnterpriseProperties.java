package ai.forger.enterprise.config;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Non-secret enterprise settings and nested security / CORS configuration bound from YAML.
 */
@Getter
@Setter
@ConfigurationProperties(prefix = "enterprise")
public class EnterpriseProperties {

  /** Stub, live, or bridge integration mode label for health and routing metadata. */
  private String integrationMode = "stub";

  private String complianceProvider = "default";
  private String auditTopic = "forge.enterprise.audit";
  private final Cors cors = new Cors();
  private final Security security = new Security();

  @Getter
  @Setter
  public static class Cors {
    private List<String> allowedOrigins = List.of("http://localhost:3000");
    private List<String> allowedMethods = List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
    private List<String> allowedHeaders = List.of("*");
    private long maxAge = 3600;
  }

  @Getter
  @Setter
  public static class Security {
    private final Jwt jwt = new Jwt();
    /** In-memory users for token issuance (typical for dev); prefer external IdP in production. */
    private List<BootstrapUser> bootstrapUsers = new ArrayList<>();
    /**
     * Optional single admin for production when bootstrap-users is empty. Value must be a BCrypt
     * hash (e.g. generated via {@code BCryptPasswordEncoder}) without the {@code {bcrypt}} prefix.
     */
    private String adminUsername = "";
    private String adminPasswordBcrypt = "";
  }

  @Getter
  @Setter
  public static class Jwt {
    /** HS256 signing secret; use a long random value in production (32+ bytes). */
    private String secret = "";
    private long expirationMs = 86_400_000L;
  }

  @Getter
  @Setter
  public static class BootstrapUser {
    private String username = "";
    private String password = "";
    private List<String> roles = List.of("ENTERPRISE_USER");
  }
}
