package ai.forger.enterprise.controller;

import ai.forger.enterprise.dto.response.IntegrationStatusResponse;
import ai.forger.enterprise.service.PlatformMetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Lightweight JSON health for gateways and the web dashboard (not the Actuator probe format). */
@RestController
@RequiredArgsConstructor
public class PublicHealthController {

  private final PlatformMetadataService platformMetadataService;

  @GetMapping("/health")
  public IntegrationStatusResponse health() {
    return platformMetadataService.status();
  }
}
