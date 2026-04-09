package ai.forger.enterprise.repository;

import ai.forger.enterprise.model.EnterpriseTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EnterpriseTransactionRepository extends MongoRepository<EnterpriseTransaction, String> {}
