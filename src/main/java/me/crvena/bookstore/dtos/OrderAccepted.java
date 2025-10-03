package me.crvena.bookstore.dtos;

import java.util.UUID;

public record OrderAccepted(
    String messageId, String message) {
  public OrderAccepted(String message) {
    this(UUID.randomUUID().toString(), message);
  }
}
