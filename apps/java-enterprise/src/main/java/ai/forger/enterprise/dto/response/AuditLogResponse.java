package ai.forger.enterprise.dto.response;

import java.time.Instant;

public record AuditLogResponse(
    String id,
    String actorUsername,
    String action,
    String httpMethod,
    String requestPath,
    String outcome,
    String detail,
    Instant timestamp
) {}
