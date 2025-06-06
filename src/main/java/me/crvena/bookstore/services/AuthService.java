package me.crvena.bookstore.services;

import java.security.Permission;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.crvena.bookstore.dtos.LoginRequest;
import me.crvena.bookstore.dtos.SignupRequest;
import me.crvena.bookstore.exceptions.FieldsConflictException;
import me.crvena.bookstore.models.User;
import me.crvena.bookstore.repositories.UserRepository;

@Service
public interface AuthService {
  @Transactional
  public User signup(SignupRequest request, HttpServletRequest httpRequest,
      HttpServletResponse httpResponse)
      throws FieldsConflictException;

  public User login(LoginRequest request, HttpServletRequest httpRequest,
      HttpServletResponse httpResponse)
      throws BadCredentialsException, LockedException;

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
  private final SecurityContextRepository securityContextRepository;

  @Autowired
  private final AuthenticationManager authenticationManager;

  @Autowired
  private final SessionRegistry sessionRegistry;

  @Transactional
  public User signup(SignupRequest request, HttpServletRequest httpRequest,
      HttpServletResponse httpResponse)
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

    Authentication authentication = new UsernamePasswordAuthenticationToken(
        user, null, user.getAuthorities());

    setAuthContext(authentication, httpRequest, httpResponse);
    storeSessionToRegistry(authentication, httpRequest);

    return user;
  }

  public User login(LoginRequest request, HttpServletRequest httpRequest,
      HttpServletResponse httpResponse)
      throws BadCredentialsException, LockedException {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()));

    setAuthContext(authentication, httpRequest, httpResponse);
    storeSessionToRegistry(authentication, httpRequest);

    return (User) authentication.getPrincipal();
  }

  public void logout(HttpServletRequest request, HttpServletResponse response) {
    HttpSession session = request.getSession(false);

    if (session != null) {
      session.invalidate();
    }

    SecurityContextHolder.clearContext();

    Cookie sessionCookie = new Cookie("JSESSIONID", null);
    sessionCookie.setPath("/");
    sessionCookie.setMaxAge(0);
    sessionCookie.setHttpOnly(true);
    response.addCookie(sessionCookie);
  }

  /**
   * Bind the authentication to AuthContext which internally use session
   */
  private void setAuthContext(Authentication authentication,
      HttpServletRequest httpRequest, HttpServletResponse httpResponse) {

    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(authentication);
    SecurityContextHolder.setContext(context);
    securityContextRepository.saveContext(
        context, httpRequest, httpResponse);
  }

  /**
   * Store session to registry for manual management afterwards
   */
  private void storeSessionToRegistry(Authentication authentication, HttpServletRequest httpRequest) {
    HttpSession session = httpRequest.getSession(false);
    if (session != null) {
      sessionRegistry.registerNewSession(session.getId(), authentication.getPrincipal());
    }
  }
}
