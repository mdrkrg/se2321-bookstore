package me.crvena.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import me.crvena.bookstore.services.OrderService;
import me.crvena.bookstore.services.UserService;
import me.crvena.bookstore.dtos.OrderRequest;
import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;

@RestController
@RequestMapping("/api/order")
// @CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

  @Autowired
  private OrderService orderService;

  @Autowired
  private UserService userService;

  /**
   * NOTE: No _embed if empty
   */
  @Description("Get order list for current user.")
  @RestResource(rel = "order")
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<Page<Order>> getOrderList(Pageable pageable) {
    // TODO: Spring Security user
    // WARN: test only user implementation
    User user = userService.getOrCreateTestUser();
    Page<Order> orders = orderService.getOrdersByUser(user, pageable);

    return ResponseEntity.ok(orders);
  }

  @RequestMapping(method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
    // TODO: Spring Security user
    // WARN: test only user implementation
    User user = userService.getOrCreateTestUser();

    Order order = orderService.placeOrder(user, orderRequest);
    return new ResponseEntity<>(order, HttpStatus.CREATED);
  }

}
