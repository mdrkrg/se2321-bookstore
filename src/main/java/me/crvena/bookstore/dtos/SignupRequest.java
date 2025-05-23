package me.crvena.bookstore.dtos;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.crvena.bookstore.enums.Role;
import lombok.AllArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
  private String email;
  private String password;
  private String username;
  // private Role role;
}
