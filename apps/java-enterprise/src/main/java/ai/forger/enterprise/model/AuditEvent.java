package ai.forger.enterprise.model;

import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Immutable-style audit trail for HTTP API actions (who / what / when). */
@Document(collection = "enterprise_audit_logs")
@Getter
@Setter
public class AuditEvent {

  @Id private String id;
  private String actorUsername;
  /** Declared action, usually {@code ClassName.methodName}. */
  private String action;
  private String httpMethod;
  private String requestPath;
  private String outcome;
  private String detail;
  private Instant timestamp;
}
