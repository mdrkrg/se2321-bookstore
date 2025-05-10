package me.crvena.bookstore.controllers;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import me.crvena.bookstore.services.OrderService;
import me.crvena.bookstore.services.UserService;
import me.crvena.bookstore.dtos.OrderRequest;
import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.OrderItem;
import me.crvena.bookstore.models.User;

// @RestController
// @RequestMapping("/order")
// @CrossOrigin(origins = "http://localhost:3000")
@RepositoryRestController
public class OrderController {

  @Autowired
  private OrderService orderService;

  @Autowired
  private UserService userService;

  @Autowired
  private PagedResourcesAssembler<Order> pagedAssembler;

  @Autowired
  private EntityLinks entityLinks;

  /**
   * NOTE: No _embed if empty
   */
  @GetMapping
  @Description("Get order list for current user.")
  @RestResource(rel = "order")
  @RequestMapping(value = "/order", method = RequestMethod.GET, produces = "application/hal+json")
  public ResponseEntity<PagedModel<EntityModel<Order>>> getOrderList(Pageable pageable) {
    // TODO: Spring Security user
    // WARN: test only user implementation
    User user = userService.getOrCreateTestUser();
    Page<Order> orders = orderService.getOrdersByUser(user, pageable);

    PagedModel<EntityModel<Order>> pagedModel = pagedAssembler.toModel(orders, EntityModel::of);
    pagedModel.forEach(model -> {
      model.add(entityLinks.linkForItemResource(Order.class,
          model.getContent().getId()).withSelfRel());
      model.add(entityLinks.linkForItemResource(Order.class,
          model.getContent().getId()).withRel("order"));
      // add items link
      // FIXME: Too ugly!!
      String itemsLinkUri = ServletUriComponentsBuilder.fromCurrentRequestUri()
          .pathSegment(model.getContent().getId().toString())
          .pathSegment("items")
          .build()
          .toUriString();
      Link itemsLink = Link.of(itemsLinkUri, "items");
      model.add(itemsLink);
    });
    // FIXME: include an embedded when returned empty list
    return ResponseEntity.ok(pagedModel);
  }

  // @PostMapping("/create")
  @RequestMapping(value = "/order", method = RequestMethod.POST, produces = "application/hal+json")
  public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
    // TODO: Spring Security user
    // WARN: test only user implementation
    User user = userService.getOrCreateTestUser();

    Order order = orderService.placeOrder(user, orderRequest);
    return new ResponseEntity<>(order, HttpStatus.CREATED);
  }

}
