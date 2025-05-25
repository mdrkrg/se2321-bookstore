package me.crvena.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import me.crvena.bookstore.repositories.UserRepository;
import me.crvena.bookstore.services.UserService;
import me.crvena.bookstore.dtos.AdminModifyUserRequest;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import me.crvena.bookstore.models.User;

@Validated
@RestController
@RequestMapping("/api/admin/user")
public class AdminUserController {

  @Autowired
  private UserRepository repository;

  @Autowired
  private UserService service;

  @Description("Show all users.")
  @RestResource(rel = "user")
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  // public ResponseEntity<Page<Book>> findAll(Pageable pageable) {
  public ResponseEntity<ListResponse<User>> findAll() {
    return ResponseEntity.ok(new ListResponse<>(repository.findAll()));
  }

  @Description("Show a specific user by their id.")
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
    User user = repository.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(User.class, id));
    try {
      user = service.modifyUser(user, data);
      return ResponseEntity.ok(user);
    } catch (RuntimeException e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RestResource(rel = "user")
  @RequestMapping(path = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
  public ResponseEntity<User> lockUserAccount(@PathVariable("id") Long id) {
    User user = repository.findById(id).orElseThrow(() -> new ResourceDoesNotExist(User.class, id));
    user.setAccountNonLocked(true);
    repository.save(user);
    return ResponseEntity.ok(user);
  }
}
