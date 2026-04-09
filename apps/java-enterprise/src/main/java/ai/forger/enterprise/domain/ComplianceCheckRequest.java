package ai.forger.enterprise.domain;

import jakarta.validation.constraints.NotBlank;

public record ComplianceCheckRequest(
    @NotBlank String agentId,
    String environment,
    String requestedBy
) {}
