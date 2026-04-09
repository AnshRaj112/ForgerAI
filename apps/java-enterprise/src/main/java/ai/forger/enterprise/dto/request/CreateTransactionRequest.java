package ai.forger.enterprise.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Map;

public record CreateTransactionRequest(
    @NotBlank String reference,
    @NotNull BigDecimal amount,
    @NotBlank @Size(min = 3, max = 3) String currency,
    Map<String, Object> metadata
) {}
