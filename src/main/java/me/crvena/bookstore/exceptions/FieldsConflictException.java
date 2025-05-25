package me.crvena.bookstore.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.BindException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Much like {@link MethodArgumentNotValidException} but with error code of
 * {@link HttpStatus.CONFLICT}
 * 
 * @author Gemini 2.5 Pro
 */
public class FieldsConflictException extends BindException implements ErrorResponse {

  /**
   * Constructor for {@link FieldsConflictException}.
   * 
   * @param bindingResult the results of the conflict checks, containing
   *                      field-specific errors.
   */
  public FieldsConflictException(BindingResult bindingResult) {
    super(bindingResult);
  }

  /**
   * Convenience constructor if you are starting with a target object and want to
   * add errors.
   * You would then use the inherited {@code rejectValue} methods.
   * 
   * @param target     the target bean that has conflicts
   * @param objectName the name of the target object
   */
  public FieldsConflictException(Object target, String objectName) {
    super(new BeanPropertyBindingResult(target, objectName));
  }

  @Override
  public HttpStatusCode getStatusCode() {
    return HttpStatus.CONFLICT;
  }

  @Override
  public ProblemDetail getBody() {
    ProblemDetail problemDetail = ProblemDetail.forStatus(getStatusCode());
    problemDetail.setTitle("Data Conflict");

    // Use the detailed message from BindException (which includes all errors)
    // or a more specific message.
    problemDetail.setDetail("One or more fields conflict with existing data. " + super.getMessage());

    // Optionally, add structured field errors for ProblemDetail consumers
    BindingResult bindingResult = getBindingResult();
    List<Map<String, Object>> conflictingFields = new ArrayList<>();
    for (FieldError fieldError : bindingResult.getFieldErrors()) {
      Map<String, Object> errorMap = new HashMap<>();
      errorMap.put("field", fieldError.getField());
      errorMap.put("message", fieldError.getDefaultMessage());
      if (fieldError.getRejectedValue() != null) {
        errorMap.put("rejectedValue", fieldError.getRejectedValue().toString());
      }
      errorMap.put("code", fieldError.getCode());
      conflictingFields.add(errorMap);
    }
    if (!conflictingFields.isEmpty()) {
      problemDetail.setProperty("conflictingFields", conflictingFields);
    }

    List<Map<String, String>> globalConflicts = new ArrayList<>();
    for (ObjectError globalError : bindingResult.getGlobalErrors()) {
      Map<String, String> errorMap = new HashMap<>();
      errorMap.put("objectName", globalError.getObjectName());
      errorMap.put("message", globalError.getDefaultMessage());
      errorMap.put("code", globalError.getCode());
      globalConflicts.add(errorMap);
    }
    if (!globalConflicts.isEmpty()) {
      problemDetail.setProperty("globalConflicts", globalConflicts);
    }

    return problemDetail;
  }
}
