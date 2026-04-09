package ai.forger.enterprise.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record CreateTransactionResponse(
    String id,
    String reference,
    BigDecimal amount,
    String currency,
    Instant recordedAt
) {}
