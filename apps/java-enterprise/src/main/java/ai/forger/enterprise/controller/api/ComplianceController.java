package ai.forger.enterprise.controller.api;

import ai.forger.enterprise.dto.request.ComplianceCheckRequest;
import ai.forger.enterprise.dto.response.ComplianceCheckResponse;
import ai.forger.enterprise.service.ComplianceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enterprise")
@RequiredArgsConstructor
public class ComplianceController {

  private final ComplianceService complianceService;

  @PostMapping("/compliance/check")
  public ComplianceCheckResponse complianceCheck(@Valid @RequestBody ComplianceCheckRequest request) {
    return complianceService.check(request);
  }
}
