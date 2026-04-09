package ai.forger.enterprise.model;

import java.time.Instant;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Outbound enterprise connector call (e.g. SAP RFC, Salesforce REST). */
@Document(collection = "enterprise_integrations")
@Getter
@Setter
public class EnterpriseIntegration {

  @Id private String id;
  /** Logical provider key, e.g. SAP, SALESFORCE. */
  private String provider;
  private String operation;
  private String externalSystemId;
  private Map<String, Object> payload;
  private String status;
  private Instant createdAt;
}
