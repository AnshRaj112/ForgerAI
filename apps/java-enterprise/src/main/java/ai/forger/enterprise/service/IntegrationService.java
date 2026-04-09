package ai.forger.enterprise.service;

import ai.forger.enterprise.dto.request.CreateIntegrationRequest;
import ai.forger.enterprise.dto.response.CreateIntegrationResponse;

public interface IntegrationService {

  CreateIntegrationResponse create(CreateIntegrationRequest request);
}
