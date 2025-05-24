package me.crvena.bookstore.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import io.jsonwebtoken.ExpiredJwtException;
import me.crvena.bookstore.exceptions.PermissionDenied;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import me.crvena.bookstore.dtos.ErrorResponse;
import me.crvena.bookstore.utils.ResponseUtil;

@ControllerAdvice
public class GlobalExceptionHandler {
  // @ExceptionHandler(Exception.class)
  // public ResponseEntity<ErrorResponse> handleGenericException(
  // Exception ex, WebRequest request) {

  // return ResponseUtil.createErrorResponse(
  // HttpStatus.INTERNAL_SERVER_ERROR,
  // ex.getMessage(),
  // request);
  // }

  @ExceptionHandler(ResourceDoesNotExist.class)
  public ResponseEntity<ErrorResponse> handleResourceDoesNotExist(
      Exception ex, WebRequest request) {

    return ResponseUtil.createErrorResponse(
        HttpStatus.NOT_FOUND,
        ex.getMessage(),
        request);
  }

  @ExceptionHandler(PermissionDenied.class)
  public ResponseEntity<ErrorResponse> handlePermissionDenied(
      Exception ex, WebRequest request) {

    return ResponseUtil.createErrorResponse(
        HttpStatus.FORBIDDEN,
        ex.getMessage(),
        request);
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseBody
  public Map<String, String> handleValidationExceptions(
      MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    return errors;
  }
}
