package me.crvena.bookstore.exceptions;

public class ResourceDoesNotExistException extends RuntimeException {
  public ResourceDoesNotExistException(Class<?> clazz, Long id) {
    super("Object of model " + clazz.getSimpleName() + " with id " + id + " does not exist");
  }
}
