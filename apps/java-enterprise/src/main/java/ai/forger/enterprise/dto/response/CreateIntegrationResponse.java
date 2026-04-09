package ai.forger.enterprise.dto.response;

import java.time.Instant;

public record CreateIntegrationResponse(
    String id,
    String provider,
    String operation,
    String status,
    Instant createdAt
) {}
