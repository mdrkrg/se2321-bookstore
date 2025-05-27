package me.crvena.bookstore.controllers;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.crvena.bookstore.dtos.LoginRequest;
import me.crvena.bookstore.dtos.SignupRequest;
import me.crvena.bookstore.dtos.UserDto;
import me.crvena.bookstore.exceptions.FieldsConflictException;
import me.crvena.bookstore.exceptions.PermissionDenied;
import me.crvena.bookstore.models.User;
import me.crvena.bookstore.services.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  @Autowired
  private final AuthService authService;

  @PostMapping("/signup")
  public ResponseEntity<UserDto> signup(
      @Valid @RequestBody SignupRequest requestBody, HttpServletResponse response)
      throws FieldsConflictException {
    var user = authService.signup(requestBody, response);
    return ResponseEntity.ok(UserDto.buildFromUser(user));
  }

  /**
   * Redirect or return the logined user
   *
   * @return {@link User} or {@link RedirectView} if next parameter is provided
   */
  @PostMapping("/login")
  public ResponseEntity<?> login(
      @Valid @RequestBody LoginRequest request,
      HttpServletResponse response,
      HttpServletRequest httpRequest,
      @RequestParam(value = "next", required = false) String next) {
    try {
      var user = authService.login(request, response);
      if (next != null && !next.isEmpty()) {
        // redirect to next
        RedirectView redirect = new RedirectView(next);
        return ResponseEntity.status(HttpStatus.FOUND).body(redirect);
      } else {
        return ResponseEntity.ok(UserDto.buildFromUser(user));
      }
    } catch (NoSuchElementException e) {
      // handle login failure
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    } catch (BadCredentialsException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    } catch (PermissionDenied e) {
      // user account is locked
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
    }
  }

  @GetMapping("/curuser")
  public ResponseEntity<UserDto> getUserByToken() {
    var user = AuthService.getRequestUser();
    if (user == null) {
      return ResponseEntity.ok(UserDto.builder().build());
    }
    return ResponseEntity.ok(UserDto.buildFromUser(user));
  }

  @GetMapping("/logout")
  public RedirectView logout(HttpServletResponse response, HttpServletRequest httpRequest) {
    return new RedirectView("/");
  }
}
