package me.crvena.bookstore.dtos;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;
import me.crvena.bookstore.enums.Role;
import me.crvena.bookstore.models.User;
import me.crvena.bookstore.models.UserInfo;

@Builder
@Data
public class UserDto {

  private Long id;

  private String username;

  private String email;

  private Role role;

  private BigDecimal balance;

  private UserInfo userInfo;

  @Builder.Default
  private Long loginMillis = Long.valueOf(0);

  public static UserDto buildFromUser(User user) {
    return UserDto.builder()
        .id(user.getId())
        .username(user.getUsername())
        .role(user.getRole())
        .balance(user.getBalance())
        .email(user.getEmail())
        .userInfo(user.getUserInfo())
        .build();
  }
}
