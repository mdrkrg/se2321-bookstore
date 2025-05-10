package me.crvena.bookstore.exceptions;

public class ResourceDoesNotExist extends RuntimeException {
  public ResourceDoesNotExist(Class<?> clazz, Long id) {
    super("Object of model " + clazz.getSimpleName() + " with id " + id + " does not exist");
  }
}
