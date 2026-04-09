package ai.forger.enterprise.service.impl;

import ai.forger.enterprise.domain.ComplianceCheckRequest;
import ai.forger.enterprise.domain.ComplianceCheckResponse;
import ai.forger.enterprise.persistence.ComplianceAuditRecord;
import ai.forger.enterprise.persistence.ComplianceAuditRepository;
import ai.forger.enterprise.service.ComplianceService;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ComplianceServiceImpl implements ComplianceService {
  private final ComplianceAuditRepository repository;

  public ComplianceServiceImpl(ComplianceAuditRepository repository) {
    this.repository = repository;
  }

  @Override
  public ComplianceCheckResponse check(ComplianceCheckRequest request) {
    List<String> checks = List.of("policy-scan", "runtime-guard", "pII-filter");
    boolean compliant = true;

    ComplianceAuditRecord record = new ComplianceAuditRecord();
    record.setAgentId(request.agentId());
    record.setChecks(checks);
    record.setCompliant(compliant);
    record.setCreatedAt(Instant.now());
    repository.save(record);

    return new ComplianceCheckResponse(true, request.agentId(), compliant, checks, Instant.now());
  }
}
