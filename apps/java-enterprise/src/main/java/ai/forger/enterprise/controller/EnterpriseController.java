package ai.forger.enterprise.controller;

import ai.forger.enterprise.domain.ComplianceCheckRequest;
import ai.forger.enterprise.domain.ComplianceCheckResponse;
import ai.forger.enterprise.domain.IntegrationStatusResponse;
import ai.forger.enterprise.service.ComplianceService;
import ai.forger.enterprise.service.EnterpriseIntegrationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enterprise")
public class EnterpriseController {
  private final ComplianceService complianceService;
  private final EnterpriseIntegrationService integrationService;

  public EnterpriseController(
      ComplianceService complianceService,
      EnterpriseIntegrationService integrationService
  ) {
    this.complianceService = complianceService;
    this.integrationService = integrationService;
  }

  @GetMapping("/health")
  public IntegrationStatusResponse health() {
    return integrationService.integrationStatus();
  }

  @PostMapping("/compliance/check")
  public ComplianceCheckResponse complianceCheck(@Valid @RequestBody ComplianceCheckRequest request) {
    return complianceService.check(request);
  }
}
