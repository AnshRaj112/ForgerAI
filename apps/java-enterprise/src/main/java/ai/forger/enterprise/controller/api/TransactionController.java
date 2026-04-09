package ai.forger.enterprise.controller.api;

import ai.forger.enterprise.dto.request.CreateTransactionRequest;
import ai.forger.enterprise.dto.response.CreateTransactionResponse;
import ai.forger.enterprise.service.TransactionRecordingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enterprise")
@RequiredArgsConstructor
public class TransactionController {

  private final TransactionRecordingService transactionRecordingService;

  @PostMapping("/transactions")
  public CreateTransactionResponse createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
    return transactionRecordingService.record(request);
  }
}
