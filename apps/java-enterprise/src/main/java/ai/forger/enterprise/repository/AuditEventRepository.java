package ai.forger.enterprise.repository;

import ai.forger.enterprise.model.AuditEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuditEventRepository extends MongoRepository<AuditEvent, String> {}
