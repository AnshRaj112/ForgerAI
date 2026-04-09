package ai.forger.enterprise.domain;

public record IntegrationStatusResponse(
    boolean ok,
    String mode,
    String provider,
    String auditTopic
) {}
