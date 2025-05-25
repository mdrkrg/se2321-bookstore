package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.Optional;

import org.hibernate.validator.constraints.URL;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;
import me.crvena.bookstore.enums.Role;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminModifyUserRequest {

  @Data
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public static class UserInfoDto {
    private Optional<@Size(max = 255) String> nickname;

    private Optional<@URL String> avatar;

    private Optional<@Size(max = 255) String> introduction;
  }

  private Optional<@Min(0) BigDecimal> balance;

  private Optional<Boolean> accountNonLocked;

  private Optional<Role> role;

  // have to use @Valid here
  private Optional<@Valid UserInfoDto> userInfo;
}
