package ai.forger.enterprise.model;

import java.time.Instant;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "compliance_audit")
@Getter
@Setter
public class ComplianceAuditRecord {

  @Id private String id;
  private String agentId;
  private boolean compliant;
  private List<String> checks;
  private Instant createdAt;
}
