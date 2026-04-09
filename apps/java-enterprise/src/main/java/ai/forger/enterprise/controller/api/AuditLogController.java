package ai.forger.enterprise.controller.api;

import ai.forger.enterprise.dto.response.AuditLogResponse;
import ai.forger.enterprise.service.AuditQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enterprise")
@RequiredArgsConstructor
public class AuditLogController {

  private final AuditQueryService auditQueryService;

  @GetMapping("/audit-logs")
  public Page<AuditLogResponse> listAuditLogs(
      @PageableDefault(size = 20, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable
  ) {
    return auditQueryService.list(pageable);
  }
}
