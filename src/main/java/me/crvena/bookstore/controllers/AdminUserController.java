package me.crvena.bookstore.controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import me.crvena.bookstore.repositories.UserRepository;
import me.crvena.bookstore.services.AuthService;
import me.crvena.bookstore.services.UserService;
import me.crvena.bookstore.dtos.AdminModifyUserRequest;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import me.crvena.bookstore.models.User;

@Validated
@RestController
@RequestMapping("/api/admin/user")
public class AdminUserController {

  Logger logger = LoggerFactory.getLogger(AdminUserController.class);

  @Autowired
  private UserRepository repository;

  @Autowired
  private UserService service;

  @Autowired
  private SessionRegistry sessionRegistry;

  /**
   * Show all users
   */
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<ListResponse<User>> findAll() {
    // TODO: paging
    return ResponseEntity.ok(new ListResponse<>(repository.findAll()));
  }

  /**
   * Show a specific user by their id.
   */
  @RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<User> findOneUser(@PathVariable("id") Long id) {
    User user = repository.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(User.class, id));
    return ResponseEntity.ok(user);
  }

  @RequestMapping(path = "/{id}", method = { RequestMethod.PUT,
      RequestMethod.PATCH }, produces = "application/json")
  public ResponseEntity<User> modifyUser(
      @PathVariable("id") Long id, @Valid @RequestBody AdminModifyUserRequest data) {
    logger.info("Modifying user...");
    logger.debug("Request body: " + data);
    User userToModify = repository.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(User.class, id));
    logger.debug("Modifying user " + userToModify);
    try {
      User modifiedUser = service.modifyUser(userToModify, data);
      logger.debug("Modified user " + modifiedUser);

      User currentUser = AuthService.getRequestUser();

      logger.debug("Checking if current user is the target");
      // check self modify
      if (currentUser != null && currentUser.getId().equals(modifiedUser.getId())) {
        boolean isNowDisabled = !modifiedUser.isAccountNonLocked() || !modifiedUser.isEnabled();
        if (isNowDisabled) {
          logger.info("Current user is disabled");
          // admin locked own account
          invalidateUserSessions(modifiedUser.getUsername());
        } else {
          // admin changed own details
          Authentication newAuth = new UsernamePasswordAuthenticationToken(
              modifiedUser,
              modifiedUser.getPassword(),
              modifiedUser.getAuthorities());
          SecurityContextHolder.getContext().setAuthentication(newAuth);
        }
      }
      return ResponseEntity.ok(userToModify);
    } catch (RuntimeException e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
  public ResponseEntity<User> lockUserAccount(@PathVariable("id") Long id) {
    User user = repository.findById(id).orElseThrow(() -> new ResourceDoesNotExist(User.class, id));
    user.setAccountNonLocked(true);
    repository.save(user);
    invalidateUserSessions(user.getUsername());
    return ResponseEntity.ok(user);
  }

  private void invalidateUserSessions(String username) {
    logger.info("Invalidating session for user " + username);
    List<Object> principals = sessionRegistry.getAllPrincipals();
    logger.debug("Size of principals: " + principals.size());
    for (Object principal : principals) {
      logger.debug("Checking principal " + principal);
      if (principal instanceof UserDetails) {
        UserDetails userDetails = (UserDetails) principal;
        logger.debug("Checking userDetails " + userDetails.getUsername());
        if (userDetails.getUsername().equals(username)) {
          logger.info("Found matching userDetails, expiring session...");
          List<SessionInformation> sessions = sessionRegistry.getAllSessions(principal, false);
          for (SessionInformation session : sessions) {
            session.expireNow();
          }
        }
      }
    }
  }
}
