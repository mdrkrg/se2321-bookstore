package me.crvena.bookstore.dtos;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorResponse {
  private String timestamp;
  private int status;
  private String error;
  private String message;
  private String path;

  public ErrorResponse(int status, String error, String message, String path) {
    this.timestamp = LocalDateTime.now().toString();
    this.status = status;
    this.error = error;
    this.message = message;
    this.path = path;
  }
}
