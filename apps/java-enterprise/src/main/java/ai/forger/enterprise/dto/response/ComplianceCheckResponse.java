package ai.forger.enterprise.dto.response;

import java.time.Instant;
import java.util.List;

public record ComplianceCheckResponse(
    boolean ok,
    String agentId,
    boolean compliant,
    List<String> checks,
    Instant evaluatedAt
) {}
