package me.crvena.bookstore.dtos;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.crvena.bookstore.enums.Role;
import me.crvena.bookstore.models.User;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
  @Email
  @NotBlank
  private String email;
  @NotBlank
  private String password;
  @NotBlank
  @Valid
  @Size(max = User.USERNAME_MAX_LENGTH, min = User.USERNAME_MIN_LENGTH)
  private String username;
  // private Role role;
}
