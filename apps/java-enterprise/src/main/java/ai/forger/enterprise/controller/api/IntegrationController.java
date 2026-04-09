package ai.forger.enterprise.controller.api;

import ai.forger.enterprise.dto.request.CreateIntegrationRequest;
import ai.forger.enterprise.dto.response.CreateIntegrationResponse;
import ai.forger.enterprise.service.IntegrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enterprise")
@RequiredArgsConstructor
public class IntegrationController {

  private final IntegrationService integrationService;

  @PostMapping("/integrations")
  public CreateIntegrationResponse createIntegration(@Valid @RequestBody CreateIntegrationRequest request) {
    return integrationService.create(request);
  }
}
