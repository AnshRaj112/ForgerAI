package ai.forger.enterprise.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record CreateIntegrationRequest(
    @NotBlank String provider,
    @NotBlank String operation,
    String externalSystemId,
    Map<String, Object> payload
) {}
