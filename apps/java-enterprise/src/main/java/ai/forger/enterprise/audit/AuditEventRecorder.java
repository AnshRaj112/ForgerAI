package ai.forger.enterprise.audit;

import ai.forger.enterprise.model.AuditEvent;
import ai.forger.enterprise.repository.AuditEventRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Persists audit rows in a separate transaction so failures in the main business transaction still
 * leave an immutable trace when desired, and successful calls are committed even if a downstream
 * error occurs in the same request (depending on caller flow).
 */
@Service
@RequiredArgsConstructor
public class AuditEventRecorder {

  private final AuditEventRepository repository;

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void recordSuccess(
      String actorUsername,
      String action,
      String httpMethod,
      String requestPath,
      String detail
  ) {
    save(actorUsername, action, httpMethod, requestPath, "SUCCESS", detail);
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void recordFailure(
      String actorUsername,
      String action,
      String httpMethod,
      String requestPath,
      String detail
  ) {
    save(actorUsername, action, httpMethod, requestPath, "FAILURE", detail);
  }

  private void save(
      String actorUsername,
      String action,
      String httpMethod,
      String requestPath,
      String outcome,
      String detail
  ) {
    AuditEvent e = new AuditEvent();
    e.setActorUsername(actorUsername);
    e.setAction(action);
    e.setHttpMethod(httpMethod);
    e.setRequestPath(requestPath);
    e.setOutcome(outcome);
    e.setDetail(detail);
    e.setTimestamp(Instant.now());
    repository.save(e);
  }
}
