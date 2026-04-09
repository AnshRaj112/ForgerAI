package ai.forger.enterprise.repository;

import ai.forger.enterprise.model.ComplianceAuditRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComplianceAuditRepository extends MongoRepository<ComplianceAuditRecord, String> {}
