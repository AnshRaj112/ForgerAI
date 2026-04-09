package ai.forger.enterprise.service;

import ai.forger.enterprise.dto.request.ComplianceCheckRequest;
import ai.forger.enterprise.dto.response.ComplianceCheckResponse;

public interface ComplianceService {

  ComplianceCheckResponse check(ComplianceCheckRequest request);
}
