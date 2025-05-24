package me.crvena.bookstore.exceptions;

public class ConflictExceptions {
  public static class UsernameAlreadyExist extends RuntimeException {
    public UsernameAlreadyExist(String message) {
      super(message);
    }
  }

  public static class EmailAlreadyExist extends RuntimeException {
    public EmailAlreadyExist(String message) {
      super(message);
    }
  }

  public static class CartItemAlreadyExist extends RuntimeException {
    public CartItemAlreadyExist(String message) {
      super(message);
    }
  }

  public static class ResourceAlreadyExist extends RuntimeException {
    public ResourceAlreadyExist(String message) {
      super(message);
    }
  }
}
