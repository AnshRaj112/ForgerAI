package ai.forger.enterprise.exception;

/** Domain-level failure mapped to a stable API error code and HTTP status. */
public class BusinessException extends RuntimeException {

  private final String code;
  private final int httpStatus;

  public BusinessException(String code, int httpStatus, String message) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
  }

  public String getCode() {
    return code;
  }

  public int getHttpStatus() {
    return httpStatus;
  }
}
