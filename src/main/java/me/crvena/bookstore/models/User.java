package me.crvena.bookstore.models;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.validator.constraints.*;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;

import me.crvena.bookstore.enums.Role;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.math.BigDecimal;
import java.util.Collection;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "users", indexes = @Index(columnList = "username"))
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
// public class User extends BaseModel implements UserDetails {
public class User extends BaseModel {
  private static final int USERNAME_MAX_LENGTH = 50;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  @EqualsAndHashCode.Include
  private Long id;

  @NonNull
  @Column(nullable = false, unique = true)
  @Length(max = USERNAME_MAX_LENGTH)
  private String username;

  @NonNull
  @Column(nullable = false, unique = true)
  @Email
  private String email;

  /**
   * User's raw password, will not be persistant.
   */
  @Transient
  private String rawPassword;

  /**
   * User's hashed password.
   */
  @NonNull
  @Column(nullable = false)
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @ColumnDefault("'USER'")
  private Role role;

  @Column(precision = 19, scale = 2, nullable = false)
  @ColumnDefault("0")
  private BigDecimal balance = BigDecimal.ZERO;

  @ColumnDefault("true")
  private boolean enabled = true;
  @ColumnDefault("true")
  private boolean accountNonExpired = true;
  @ColumnDefault("true")
  private boolean accountNonLocked = true;

  // @Override
  private boolean isCredentialsNonExpired() {
    return false;
  }

  // Relationships (e.g., to Cart, Order)

  // @Override
  // public Collection<? extends GrantedAuthority> getAuthorities() {
  // return role.getAuthorities();
  // }

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, optional = false)
  @PrimaryKeyJoinColumn
  @ToString.Exclude
  @Setter(AccessLevel.NONE)
  private UserInfo userInfo = new UserInfo(this);
}
