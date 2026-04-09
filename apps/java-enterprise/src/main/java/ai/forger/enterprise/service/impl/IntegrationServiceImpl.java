package ai.forger.enterprise.service.impl;

import ai.forger.enterprise.dto.request.CreateIntegrationRequest;
import ai.forger.enterprise.dto.response.CreateIntegrationResponse;
import ai.forger.enterprise.model.EnterpriseIntegration;
import ai.forger.enterprise.repository.EnterpriseIntegrationRepository;
import ai.forger.enterprise.service.IntegrationService;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IntegrationServiceImpl implements IntegrationService {

  private final EnterpriseIntegrationRepository repository;

  @Override
  @Transactional
  public CreateIntegrationResponse create(CreateIntegrationRequest request) {
    EnterpriseIntegration doc = new EnterpriseIntegration();
    doc.setProvider(request.provider().trim().toUpperCase());
    doc.setOperation(request.operation().trim());
    doc.setExternalSystemId(request.externalSystemId());
    doc.setPayload(request.payload());
    doc.setStatus("ACCEPTED");
    doc.setCreatedAt(Instant.now());
    EnterpriseIntegration saved = repository.save(doc);
    return new CreateIntegrationResponse(
        saved.getId(),
        saved.getProvider(),
        saved.getOperation(),
        saved.getStatus(),
        saved.getCreatedAt());
  }
}
