package ai.forger.enterprise.audit;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Records a row in {@code enterprise_audit_logs} for each call into secured REST controllers under
 * {@code controller.api}, capturing actor, HTTP verb, path, and outcome.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

  private final AuditEventRecorder recorder;

  @Around("within(ai.forger.enterprise.controller.api..*)")
  public Object auditApi(ProceedingJoinPoint joinPoint) throws Throwable {
    HttpServletRequest request = currentRequest();
    String actor = currentActor();
    String action = joinPoint.getSignature().toShortString();
    String method = request != null ? request.getMethod() : "";
    String path = request != null ? request.getRequestURI() : "";

    try {
      Object result = joinPoint.proceed();
      recorder.recordSuccess(actor, action, method, path, null);
      return result;
    } catch (Throwable ex) {
      String detail = ex.getMessage() != null ? ex.getMessage() : ex.getClass().getSimpleName();
      recorder.recordFailure(actor, action, method, path, detail);
      throw ex;
    }
  }

  private static HttpServletRequest currentRequest() {
    var attrs = RequestContextHolder.getRequestAttributes();
    if (attrs instanceof ServletRequestAttributes servletAttrs) {
      return servletAttrs.getRequest();
    }
    return null;
  }

  private static String currentActor() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      return "anonymous";
    }
    return auth.getName();
  }
}
