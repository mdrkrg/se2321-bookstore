package me.crvena.bookstore.exceptions;

public class CartItemAlreadyExistsException extends RuntimeException {
  public CartItemAlreadyExistsException(String message) {
    super(message);
  }
}
