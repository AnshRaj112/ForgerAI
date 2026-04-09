package ai.forger.enterprise.service;

import ai.forger.enterprise.domain.ComplianceCheckRequest;
import ai.forger.enterprise.domain.ComplianceCheckResponse;

public interface ComplianceService {
  ComplianceCheckResponse check(ComplianceCheckRequest request);
}
