package ai.forger.enterprise.persistence;

import java.time.Instant;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "compliance_audit")
public class ComplianceAuditRecord {
  @Id
  private String id;
  private String agentId;
  private boolean compliant;
  private List<String> checks;
  private Instant createdAt;

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getAgentId() { return agentId; }
  public void setAgentId(String agentId) { this.agentId = agentId; }
  public boolean isCompliant() { return compliant; }
  public void setCompliant(boolean compliant) { this.compliant = compliant; }
  public List<String> getChecks() { return checks; }
  public void setChecks(List<String> checks) { this.checks = checks; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
