package ai.forger.enterprise.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ComplianceCheckRequest(@NotBlank String agentId) {}
