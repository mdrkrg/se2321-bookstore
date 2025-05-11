package me.crvena.bookstore.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import me.crvena.bookstore.exceptions.CartItemAlreadyExistsException;
import me.crvena.bookstore.services.CartService;
import me.crvena.bookstore.services.UserService;
import me.crvena.bookstore.utils.ResponseUtil;
import me.crvena.bookstore.dtos.CartItemRequest;
import me.crvena.bookstore.dtos.ErrorResponse;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.models.CartItem;
import me.crvena.bookstore.models.User;

@RestController
@RequestMapping("/api/cart")
// @CrossOrigin(origins = "http://localhost:3000")
public class CartController {

  @Autowired
  private UserService userService;

  @Autowired
  private CartService cartService;

  /**
   * NOTE: No _embed if empty
   */
  // @GetMapping
  @Description("Get cart for current user.")
  @RestResource(rel = "cart")
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  // public ResponseEntity<PagedModel<EntityModel<CartItem>>> findAll(Pageable
  // pageable) {
  // public ResponseEntity<Page<CartItem>> findAll(Pageable pageable) {
  public ResponseEntity<ListResponse<CartItem>> findAll() {
    // TODO: Spring Security user
    // WARN: test only user implementation
    User user = userService.getOrCreateTestUser();
    // Page<CartItem> cartItems = cartService.getCartByUser(user, pageable);
    List<CartItem> cartItems = cartService.getCartByUser(user);

    // TODO: DTO
    return ResponseEntity.ok(new ListResponse<>(cartItems));
  }

  /**
   * @throws CartItemAlreadyExistsException
   */
  // @PostMapping
  @RequestMapping(method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<CartItem> createCartItem(
      @RequestBody CartItemRequest.PostCartItemRequest cartItemRequest) {

    // TODO: Spring Security user
    // WARN: test only user implementation
    User user = userService.getOrCreateTestUser();
    CartItem createdCartItem = cartService.createCartItem(
        user, cartItemRequest.getBookId(), cartItemRequest.getNumber());

    return new ResponseEntity<>(createdCartItem, HttpStatus.CREATED);
  }

  @ExceptionHandler(CartItemAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleCartItemAlreadyExists(
      CartItemAlreadyExistsException ex, WebRequest request) {

    return ResponseUtil.createErrorResponse(
        HttpStatus.CONFLICT, ex.getMessage(), request);
  }

  @RequestMapping(path = "/{id}", method = { RequestMethod.PUT,
      RequestMethod.PATCH }, produces = "application/json")
  public ResponseEntity<CartItem> patchCartItem(
      @PathVariable("id") Long id,
      @RequestBody CartItemRequest.PatchCartItemRequest request) {

    // TODO: validate user

    CartItem cartItem = cartService.modifyCartItem(id, request.getNumber());
    return ResponseEntity.ok(cartItem);
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
  public ResponseEntity<CartItem> deleteCartItem(
      @PathVariable("id") Long id) {

    // TODO: validate user

    cartService.deleteCartItem(id);
    return new ResponseEntity<>(HttpStatus.OK);
  }

}
