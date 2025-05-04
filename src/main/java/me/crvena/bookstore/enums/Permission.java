package me.crvena.bookstore.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

  USER_READ("user:read"),
  USER_WRITE("user:write"),
  USER_DELETE("user:delete"),
  USER_UPDATE("user:update"),

  ADMIN_READ("admin:read"),
  ADMIN_WRITE("admin:write"),
  ADMIN_DELETE("admin:delete"),
  ADMIN_UPDATE("admin:update");

  @Getter
  private final String permission;
}
