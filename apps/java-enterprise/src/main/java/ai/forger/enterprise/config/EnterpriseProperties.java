package ai.forger.enterprise.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "enterprise")
public record EnterpriseProperties(
    String integrationMode,
    String complianceProvider,
    String auditTopic
) {}
