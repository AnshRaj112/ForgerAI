package ai.forger.enterprise.config;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class CorsConfig {

  private final EnterpriseProperties enterpriseProperties;

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    EnterpriseProperties.Cors c = enterpriseProperties.getCors();
    CorsConfiguration config = new CorsConfiguration();
    List<String> origins = c.getAllowedOrigins();
    if (origins == null || origins.isEmpty()) {
      config.addAllowedOriginPattern("*");
      config.setAllowCredentials(false);
    } else {
      config.setAllowedOrigins(origins);
      if (origins.size() == 1 && "*".equals(origins.getFirst())) {
        config.setAllowCredentials(false);
      } else {
        config.setAllowCredentials(true);
      }
    }
    config.setAllowedMethods(c.getAllowedMethods());
    config.setAllowedHeaders(c.getAllowedHeaders());
    config.setMaxAge(c.getMaxAge());
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}
