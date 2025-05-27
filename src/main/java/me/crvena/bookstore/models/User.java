package me.crvena.bookstore.models;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.validator.constraints.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.data.annotation.ReadOnlyProperty;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import me.crvena.bookstore.enums.Role;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.security.Permission;
import java.util.Collection;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "users", indexes = @Index(columnList = "username"))
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
public class User extends BaseModel implements UserDetails {
  public static final int USERNAME_MAX_LENGTH = 50;
  public static final int USERNAME_MIN_LENGTH = 5;

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
  private String email;

  /**
   * User's hashed password.
   */
  @NonNull
  @JsonIgnore
  @Column(nullable = false)
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @ColumnDefault("'USER'")
  private Role role = Role.USER;

  @Column(precision = 19, scale = 2, nullable = false)
  @ColumnDefault("0")
  private BigDecimal balance = BigDecimal.ZERO;

  @ColumnDefault("true")
  private boolean enabled = true;
  @ColumnDefault("true")
  private boolean accountNonExpired = true;
  @ColumnDefault("true")
  private boolean accountNonLocked = true;

  @JsonIgnore
  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @JsonIgnore
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return role.getAuthorities();
  }

  @JsonManagedReference
  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, optional = false)
  @PrimaryKeyJoinColumn
  @ToString.Exclude
  @ReadOnlyProperty
  @Setter(AccessLevel.NONE)
  private UserInfo userInfo = new UserInfo(this);

  public boolean hasPermission(Permission permission) {
    return this.getRole().getAuthorities().stream()
        .anyMatch(access -> access.getAuthority().equals(permission.toString()));
  }
}
