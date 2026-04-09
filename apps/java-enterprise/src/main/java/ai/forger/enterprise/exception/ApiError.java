package ai.forger.enterprise.exception;

import java.time.Instant;
import java.util.List;

/** Standard JSON error body returned by {@link GlobalExceptionHandler}. */
public record ApiError(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path,
    List<FieldViolation> violations
) {
  public record FieldViolation(String field, String message) {}
}
