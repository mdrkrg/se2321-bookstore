package me.crvena.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import me.crvena.bookstore.repositories.OrderRepository;
import me.crvena.bookstore.services.OrderService;
import me.crvena.bookstore.dtos.AdminModifyOrderRequest;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import me.crvena.bookstore.models.Order;

@Validated
@RestController
@RequestMapping("/api/admin/order")
public class AdminOrderController {

  @Autowired
  private OrderRepository repository;

  @Autowired
  private OrderService service;

  /**
   * Show all orders
   */
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<ListResponse<Order>> findAll() {
    // TODO: paging
    return ResponseEntity.ok(new ListResponse<>(repository.findAll()));
  }

  /**
   * Show a specific order by their id.
   */
  @RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<Order> findOneUser(@PathVariable("id") Long id) {
    Order order = repository.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Order.class, id));
    return ResponseEntity.ok(order);
  }

  @RequestMapping(path = "/{id}", method = { RequestMethod.PUT,
      RequestMethod.PATCH }, produces = "application/json")
  public ResponseEntity<Order> modifyOrder(
      @PathVariable("id") Long id, @Valid @RequestBody AdminModifyOrderRequest data) {
    Order order = repository.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Order.class, id));
    try {
      order = service.modifyOrder(order, data);
      return ResponseEntity.ok(order);
    } catch (RuntimeException e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
