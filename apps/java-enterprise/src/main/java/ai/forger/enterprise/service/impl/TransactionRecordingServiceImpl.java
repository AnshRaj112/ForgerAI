package ai.forger.enterprise.service.impl;

import ai.forger.enterprise.dto.request.CreateTransactionRequest;
import ai.forger.enterprise.dto.response.CreateTransactionResponse;
import ai.forger.enterprise.model.EnterpriseTransaction;
import ai.forger.enterprise.repository.EnterpriseTransactionRepository;
import ai.forger.enterprise.service.TransactionRecordingService;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionRecordingServiceImpl implements TransactionRecordingService {

  private final EnterpriseTransactionRepository repository;

  @Override
  @Transactional
  public CreateTransactionResponse record(CreateTransactionRequest request) {
    EnterpriseTransaction doc = new EnterpriseTransaction();
    doc.setReference(request.reference().trim());
    doc.setAmount(request.amount());
    doc.setCurrency(request.currency().trim().toUpperCase());
    doc.setMetadata(request.metadata());
    doc.setRecordedAt(Instant.now());
    EnterpriseTransaction saved = repository.save(doc);
    return new CreateTransactionResponse(
        saved.getId(),
        saved.getReference(),
        saved.getAmount(),
        saved.getCurrency(),
        saved.getRecordedAt());
  }
}
