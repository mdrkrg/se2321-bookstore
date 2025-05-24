package me.crvena.bookstore.exceptions;

public class ConflictExceptions {
  public static class UsernameAlreadyExistsException extends RuntimeException {
    public UsernameAlreadyExistsException(String message) {
      super(message);
    }
  }

  public static class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
      super(message);
    }
  }

  public static class CartItemAlreadyExistsException extends RuntimeException {
    public CartItemAlreadyExistsException(String message) {
      super(message);
    }
  }
}
