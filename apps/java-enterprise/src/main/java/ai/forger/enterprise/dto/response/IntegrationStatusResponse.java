package ai.forger.enterprise.dto.response;

public record IntegrationStatusResponse(
    boolean ok,
    String service,
    String integrationMode,
    String complianceProvider,
    String auditTopic
) {}
