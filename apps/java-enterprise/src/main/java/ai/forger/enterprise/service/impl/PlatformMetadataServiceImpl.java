package ai.forger.enterprise.service.impl;

import ai.forger.enterprise.config.EnterpriseProperties;
import ai.forger.enterprise.dto.response.IntegrationStatusResponse;
import ai.forger.enterprise.service.PlatformMetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlatformMetadataServiceImpl implements PlatformMetadataService {

  private final EnterpriseProperties properties;

  @Override
  public IntegrationStatusResponse status() {
    return new IntegrationStatusResponse(
        true,
        "java-enterprise",
        properties.getIntegrationMode(),
        properties.getComplianceProvider(),
        properties.getAuditTopic());
  }
}
