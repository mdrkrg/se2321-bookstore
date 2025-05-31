package me.crvena.bookstore.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import me.crvena.bookstore.exceptions.ConflictExceptions.CartItemAlreadyExist;
import me.crvena.bookstore.services.AuthService;
import me.crvena.bookstore.services.CartService;
import me.crvena.bookstore.dtos.CartItemRequest;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.models.CartItem;
import me.crvena.bookstore.models.User;

@RestController
@RequestMapping("/api/cart")
public class CartController {

  @Autowired
  private CartService cartService;

  @Description("Get cart for current user.")
  @RestResource(rel = "cart")
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  // public ResponseEntity<PagedModel<EntityModel<CartItem>>> findAll(Pageable
  // pageable) {
  // public ResponseEntity<Page<CartItem>> findAll(Pageable pageable) {
  public ResponseEntity<ListResponse<CartItem>> findAll() {

    User user = AuthService.getRequestUser();
    // Page<CartItem> cartItems = cartService.getCartByUser(user, pageable);
    List<CartItem> cartItems = cartService.getCartByUser(user);

    // TODO: DTO
    return ResponseEntity.ok(new ListResponse<>(cartItems));
  }

  /**
   * Modify or create {@link CartItem}
   */
  @RequestMapping(method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<CartItem> createCartItem(
      @Valid @RequestBody CartItemRequest.PostCartItemRequest cartItemRequest) {

    var user = AuthService.getRequestUser();

    try {
      CartItem cartItem = cartService.createCartItem(
          user, cartItemRequest.getBookId(), cartItemRequest.getNumber());
      return new ResponseEntity<>(cartItem, HttpStatus.CREATED);
    } catch (CartItemAlreadyExist e) {
      CartItem cartItem = cartService.getCartItemByUserAndBookId(
          user, cartItemRequest.getBookId())
          .orElseThrow(() -> new RuntimeException("Unlikely to happen"));
      cartItem = cartService.modifyCartItem(
          cartItem.getId(), cartItemRequest.getNumber(), user);
      return ResponseEntity.ok(cartItem);
    }
  }

  @RequestMapping(path = "/{id}", method = { RequestMethod.PUT,
      RequestMethod.PATCH }, produces = "application/json")
  public ResponseEntity<CartItem> patchCartItem(
      @PathVariable("id") Long id,
      @Valid @RequestBody CartItemRequest.PatchCartItemRequest request) {

    // validate user
    var user = AuthService.getRequestUser();
    var cartItem = cartService.modifyCartItem(id, request.getNumber(), user);
    return ResponseEntity.ok(cartItem);
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
  public ResponseEntity<CartItem> deleteCartItem(
      @PathVariable("id") Long id) {

    // validate user
    var user = AuthService.getRequestUser();

    cartService.deleteCartItem(id, user);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

}
