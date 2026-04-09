package ai.forger.enterprise.persistence;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ComplianceAuditRepository extends MongoRepository<ComplianceAuditRecord, String> {}
