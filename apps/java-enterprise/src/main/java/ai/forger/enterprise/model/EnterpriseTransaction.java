package ai.forger.enterprise.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Compliance-oriented business transaction record (not JVM transaction). */
@Document(collection = "enterprise_transactions")
@Getter
@Setter
public class EnterpriseTransaction {

  @Id private String id;
  private String reference;
  private BigDecimal amount;
  private String currency;
  private Map<String, Object> metadata;
  private Instant recordedAt;
}
