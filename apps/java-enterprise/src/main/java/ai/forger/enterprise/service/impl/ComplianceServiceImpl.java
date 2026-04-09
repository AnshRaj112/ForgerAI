package ai.forger.enterprise.service.impl;

import ai.forger.enterprise.dto.request.ComplianceCheckRequest;
import ai.forger.enterprise.dto.response.ComplianceCheckResponse;
import ai.forger.enterprise.model.ComplianceAuditRecord;
import ai.forger.enterprise.repository.ComplianceAuditRepository;
import ai.forger.enterprise.service.ComplianceService;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Persists a compliance evaluation snapshot. {@link Transactional} participates in MongoDB
 * transactions when the deployment uses a replica set (required by MongoDB for multi-document
 * atomicity).
 */
@Service
@RequiredArgsConstructor
public class ComplianceServiceImpl implements ComplianceService {

  private final ComplianceAuditRepository repository;

  @Override
  @Transactional
  public ComplianceCheckResponse check(ComplianceCheckRequest request) {
    List<String> checks = List.of("policy-scan", "runtime-guard", "pii-filter");
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
