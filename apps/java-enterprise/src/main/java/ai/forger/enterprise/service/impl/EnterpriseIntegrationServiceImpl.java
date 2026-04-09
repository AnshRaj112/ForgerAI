package ai.forger.enterprise.service.impl;

import ai.forger.enterprise.config.EnterpriseProperties;
import ai.forger.enterprise.domain.IntegrationStatusResponse;
import ai.forger.enterprise.service.EnterpriseIntegrationService;
import org.springframework.stereotype.Service;

@Service
public class EnterpriseIntegrationServiceImpl implements EnterpriseIntegrationService {
  private final EnterpriseProperties properties;

  public EnterpriseIntegrationServiceImpl(EnterpriseProperties properties) {
    this.properties = properties;
  }

  @Override
  public IntegrationStatusResponse integrationStatus() {
    return new IntegrationStatusResponse(
        true,
        properties.integrationMode(),
        properties.complianceProvider(),
        properties.auditTopic()
    );
  }
}
