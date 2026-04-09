package ai.forger.enterprise.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(EnterpriseProperties.class)
public class AppConfig {}
