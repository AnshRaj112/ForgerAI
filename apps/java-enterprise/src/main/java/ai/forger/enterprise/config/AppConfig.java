package ai.forger.enterprise.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableConfigurationProperties(EnterpriseProperties.class)
@EnableTransactionManagement
public class AppConfig {}
