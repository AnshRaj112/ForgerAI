package ai.forger.enterprise.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidation(
      MethodArgumentNotValidException ex,
      HttpServletRequest request
  ) {
    List<ApiError.FieldViolation> violations =
        ex.getBindingResult().getFieldErrors().stream()
            .map(err -> new ApiError.FieldViolation(err.getField(), err.getDefaultMessage()))
            .collect(Collectors.toList());
    ApiError body =
        new ApiError(
            Instant.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Validation failed",
            request.getRequestURI(),
            violations);
    return ResponseEntity.badRequest().body(body);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiError> handleConstraint(
      ConstraintViolationException ex,
      HttpServletRequest request
  ) {
    List<ApiError.FieldViolation> violations =
        ex.getConstraintViolations().stream()
            .map(v -> new ApiError.FieldViolation(v.getPropertyPath().toString(), v.getMessage()))
            .collect(Collectors.toList());
    ApiError body =
        new ApiError(
            Instant.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Validation failed",
            request.getRequestURI(),
            violations);
    return ResponseEntity.badRequest().body(body);
  }

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ApiError> handleBusiness(BusinessException ex, HttpServletRequest request) {
    String reason =
        HttpStatus.resolve(ex.getHttpStatus()).map(HttpStatus::getReasonPhrase).orElse("Error");
    ApiError body =
        new ApiError(
            Instant.now(),
            ex.getHttpStatus(),
            reason,
            ex.getMessage(),
            request.getRequestURI(),
            List.of());
    return ResponseEntity.status(ex.getHttpStatus()).body(body);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ApiError> handleBadCredentials(
      BadCredentialsException ex,
      HttpServletRequest request
  ) {
    ApiError body =
        new ApiError(
            Instant.now(),
            HttpStatus.UNAUTHORIZED.value(),
            HttpStatus.UNAUTHORIZED.getReasonPhrase(),
            "Invalid credentials",
            request.getRequestURI(),
            List.of());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ApiError> handleAuth(AuthenticationException ex, HttpServletRequest request) {
    ApiError body =
        new ApiError(
            Instant.now(),
            HttpStatus.UNAUTHORIZED.value(),
            HttpStatus.UNAUTHORIZED.getReasonPhrase(),
            ex.getMessage() != null ? ex.getMessage() : "Unauthorized",
            request.getRequestURI(),
            List.of());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiError> handleDenied(AccessDeniedException ex, HttpServletRequest request) {
    ApiError body =
        new ApiError(
            Instant.now(),
            HttpStatus.FORBIDDEN.value(),
            HttpStatus.FORBIDDEN.getReasonPhrase(),
            "Forbidden",
            request.getRequestURI(),
            List.of());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest request) {
    log.error("Unhandled error on {}", request.getRequestURI(), ex);
    ApiError body =
        new ApiError(
            Instant.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
            "An unexpected error occurred",
            request.getRequestURI(),
            List.of());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
