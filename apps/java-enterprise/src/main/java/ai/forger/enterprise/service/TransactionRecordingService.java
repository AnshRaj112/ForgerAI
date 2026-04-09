package ai.forger.enterprise.service;

import ai.forger.enterprise.dto.request.CreateTransactionRequest;
import ai.forger.enterprise.dto.response.CreateTransactionResponse;

public interface TransactionRecordingService {

  CreateTransactionResponse record(CreateTransactionRequest request);
}
