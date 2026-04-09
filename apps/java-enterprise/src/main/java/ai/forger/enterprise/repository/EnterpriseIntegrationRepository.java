package ai.forger.enterprise.repository;

import ai.forger.enterprise.model.EnterpriseIntegration;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EnterpriseIntegrationRepository extends MongoRepository<EnterpriseIntegration, String> {}
