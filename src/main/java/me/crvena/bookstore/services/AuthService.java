package me.crvena.bookstore.services;

import java.security.Permission;
import java.util.NoSuchElementException;

import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.crvena.bookstore.dtos.LoginRequest;
import me.crvena.bookstore.dtos.SignupRequest;
import me.crvena.bookstore.exceptions.FieldsConflictException;
import me.crvena.bookstore.exceptions.PermissionDenied;
import me.crvena.bookstore.models.User;
import me.crvena.bookstore.repositories.UserRepository;

@Service
public interface AuthService {
  @Transactional
  public User signup(SignupRequest request, HttpServletResponse response)
      throws FieldsConflictException;

  public User login(LoginRequest request, HttpServletResponse response)
      throws NoSuchElementException, PermissionDenied;

  public void logout(HttpServletRequest request, HttpServletResponse response);

  public static User getRequestUser() {
    var user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (user.equals("anonymousUser"))
      return null;
    return (User) user;
  }

  public static boolean userHasPermission(Permission permission) {
    return getRequestUser().hasPermission(permission);
  }
}

@Service
@RequiredArgsConstructor
class AuthServiceImpl implements AuthService {

  @Value("${jwt.cookieName}")
  private String cookieName;

  @Autowired
  private final UserRepository repository;

  @Autowired
  private final PasswordEncoder passwordEncoder;

  @Autowired
  private final JwtService jwtService;

  @Autowired
  @Lazy
  private final AuthenticationManager authenticationManager;

  @Transactional
  public User signup(SignupRequest request, HttpServletResponse response)
      throws FieldsConflictException {

    var username = request.getUsername();
    var email = request.getEmail();

    BindingResult conflicts = new BeanPropertyBindingResult(
        request, "signupRequest");

    if (repository.existsByUsername(username)) {
      conflicts.rejectValue(
          "username", // field name
          "conflict.username.exists",
          "This username is already taken. Please choose a different one.");
    }
    if (repository.existsByEmail(email)) {
      conflicts.rejectValue(
          "email",
          "conflict.email.exists",
          "This email address is already registered.");
    }
    if (conflicts.hasErrors()) {
      throw new FieldsConflictException(conflicts);
    }

    var password = passwordEncoder.encode(request.getPassword());
    var user = new User(request.getUsername(), request.getEmail(), password);

    repository.save(user);
    var jwt = jwtService.generateToken(user);
    // return AuthResponse.builder().token(jwt).build();
    setAuthCookie(jwt, response);
    return user;
  }

  public User login(LoginRequest request, HttpServletResponse response)
      throws NoSuchElementException, PermissionDenied {
    try {
      var user = repository.findByUsername(request.getUsername())
          .orElseThrow(() -> new NoSuchElementException("User not found"));
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(
              request.getUsername(),
              request.getPassword()));
      if (!user.isAccountNonLocked()) {
        throw new PermissionDenied(user);
      }
      var jwt = jwtService.generateToken(user);
      setAuthCookie(jwt, response);
      return user;
    } catch (NoSuchElementException e) {
      throw e;
    } catch (PermissionDenied e) {
      throw e;
    }
  }

  public void logout(
      HttpServletRequest request,
      HttpServletResponse response) {
    deleteCookie(request, response, cookieName);
    SecurityContextHolder.clearContext();
  }

  /**
   * Use Set-Cookie header to set client jwt
   */
  private void setAuthCookie(String jwt, HttpServletResponse response) {
    ResponseCookie cookie = ResponseCookie.from(
        cookieName, jwt)
        .httpOnly(true)
        .secure(false) // Set to true in production for HTTPS
        .sameSite("Strict") // Or "Lax" as appropriate
        .path("/")
        .maxAge(jwtService.getExpirationMs() / 1000) // seconds
        .build();
    response.addHeader("Set-Cookie", cookie.toString());
  }

  private void deleteCookie(HttpServletRequest request, HttpServletResponse response, String name) {
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if (cookie.getName().equals(name)) {
          cookie.setValue("");
          cookie.setPath("/");
          cookie.setMaxAge(0);
          response.addCookie(cookie);
          break;
        }
      }
    }
  }
}
