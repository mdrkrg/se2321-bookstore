package me.crvena.bookstore.controllers;

import java.util.List;

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

import jakarta.validation.Valid;
import me.crvena.bookstore.services.AuthService;
import me.crvena.bookstore.services.OrderService;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.dtos.OrderRequest;
import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;

@RestController
@RequestMapping("/api/order")
// @CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

  @Autowired
  private OrderService orderService;

  /**
   * NOTE: No _embed if empty
   */
  @Description("Get order list for current user.")
  @RestResource(rel = "order")
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  // public ResponseEntity<Page<Order>> getOrderList(Pageable pageable) {
  public ResponseEntity<ListResponse<Order>> getOrderList() {

    User user = AuthService.getRequestUser();
    // Page<Order> orders = orderService.getOrdersByUser(user, pageable);
    List<Order> orders = orderService.getOrdersByUser(user);

    return ResponseEntity.ok(new ListResponse<>(orders));
  }

  @RequestMapping(method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderRequest orderRequest) {

    User user = AuthService.getRequestUser();

    Order order = orderService.placeOrder(user, orderRequest);
    return new ResponseEntity<>(order, HttpStatus.CREATED);
  }

}
