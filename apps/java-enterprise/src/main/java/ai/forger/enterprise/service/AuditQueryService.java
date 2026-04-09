package ai.forger.enterprise.service;

import ai.forger.enterprise.dto.response.AuditLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditQueryService {

  Page<AuditLogResponse> list(Pageable pageable);
}
