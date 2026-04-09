package ai.forger.enterprise.service.impl;

import ai.forger.enterprise.dto.response.AuditLogResponse;
import ai.forger.enterprise.model.AuditEvent;
import ai.forger.enterprise.repository.AuditEventRepository;
import ai.forger.enterprise.service.AuditQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditQueryServiceImpl implements AuditQueryService {

  private final AuditEventRepository repository;

  @Override
  @Transactional(readOnly = true)
  public Page<AuditLogResponse> list(Pageable pageable) {
    return repository.findAll(pageable).map(this::toResponse);
  }

  private AuditLogResponse toResponse(AuditEvent e) {
    return new AuditLogResponse(
        e.getId(),
        e.getActorUsername(),
        e.getAction(),
        e.getHttpMethod(),
        e.getRequestPath(),
        e.getOutcome(),
        e.getDetail(),
        e.getTimestamp());
  }
}
