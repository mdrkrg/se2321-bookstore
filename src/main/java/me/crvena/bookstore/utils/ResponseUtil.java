package me.crvena.bookstore.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import me.crvena.bookstore.dtos.ErrorResponse;

public class ResponseUtil {

  public static ResponseEntity<ErrorResponse> createErrorResponse(
      HttpStatus status, String message, WebRequest request) {

    String path = ((ServletWebRequest) request).getRequest().getRequestURI();

    ErrorResponse errorResponse = new ErrorResponse(
        status.value(),
        status.getReasonPhrase(),
        message,
        path);

    return new ResponseEntity<>(errorResponse, status);
  }
}
