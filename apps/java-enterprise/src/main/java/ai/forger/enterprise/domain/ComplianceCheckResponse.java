package ai.forger.enterprise.domain;

import java.time.Instant;
import java.util.List;

public record ComplianceCheckResponse(
    boolean ok,
    String agentId,
    boolean compliant,
    List<String> checks,
    Instant timestamp
) {}
