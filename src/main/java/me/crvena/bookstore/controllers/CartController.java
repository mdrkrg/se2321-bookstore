package me.crvena.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

import me.crvena.bookstore.services.CartService;
import me.crvena.bookstore.services.UserService;
import me.crvena.bookstore.dtos.CartItemRequest;
import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.CartItem;
import me.crvena.bookstore.models.User;

// @RestController
// @RequestMapping("/cart")
// @CrossOrigin(origins = "http://localhost:3000")
@RepositoryRestController
public class CartController {

  @Autowired
  private UserService userService;

  @Autowired
  private CartService cartService;

  @Autowired
  private PagedResourcesAssembler<CartItem> pagedResourcesAssembler;

  @Autowired
  private EntityLinks entityLinks;

  /**
   * NOTE: No _embed if empty
   */
  // @GetMapping
  @Description("Get cart for current user.")
  @RestResource(rel = "cart")
  @RequestMapping(value = "/cart", method = RequestMethod.GET, produces = "application/hal+json")
  public ResponseEntity<PagedModel<EntityModel<CartItem>>> findAll(Pageable pageable) {
    // TODO: Spring Security user
    // WARN: test only user implementation
    User user = userService.getOrCreateTestUser();
    Page<CartItem> cartItems = cartService.getCartByUser(user, pageable);

    PagedModel<EntityModel<CartItem>> pagedModel = pagedResourcesAssembler.toModel(cartItems, EntityModel::of);
    pagedModel.forEach(model -> {
      model.add(entityLinks.linkForItemResource(CartItem.class,
          model.getContent().getId()).withSelfRel());
      model.add(entityLinks.linkForItemResource(Book.class,
          model.getContent().getBook().getId()).withRel("book"));
    });
    return ResponseEntity.ok(pagedModel);
  }

  /**
   * TODO: this logic can actually put into repository
   */
  // @PostMapping
  @RequestMapping(value = "/cart", method = RequestMethod.POST, produces = "application/hal+json")
  public ResponseEntity<CartItem> createCartItem(@RequestBody CartItemRequest cartItemRequest) {
    // TODO: Spring Security user
    // WARN: test only user implementation
    User user = userService.getOrCreateTestUser();
    Optional<CartItem> original = cartService.getCartItemByUserBook(user, cartItemRequest.getBook());

    if (original.isPresent()) {
      return new ResponseEntity<>(original.get(), HttpStatus.NOT_MODIFIED);
    }

    return new ResponseEntity<>(
        cartService.createCartItem(
            user, cartItemRequest.getBook(), cartItemRequest.getNumber()),
        HttpStatus.CREATED);
  }

}
