package me.crvena.bookstore.exceptions;

import me.crvena.bookstore.models.User;

public class PermissionDenied extends RuntimeException {
  public PermissionDenied(User user, String reason) {
    super("""
        Permission denied for user %s with role %s.
        Reason: %s""".formatted(user.getUsername(), user.getRole(), reason));
  }

  public PermissionDenied(User user) {
    super("""
        Permission denied for user %s with role %s.
        """.formatted(user.getUsername(), user.getRole()));
  }
}
