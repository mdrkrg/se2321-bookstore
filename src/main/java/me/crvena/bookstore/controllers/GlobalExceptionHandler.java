package me.crvena.bookstore.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

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
}
