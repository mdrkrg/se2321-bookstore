package me.crvena.bookstore.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import jakarta.validation.Valid;
import me.crvena.bookstore.services.AuthService;
import me.crvena.bookstore.services.OrderService;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.dtos.OrderRequest;
import me.crvena.bookstore.dtos.OutOfStockErrorResponse;
import me.crvena.bookstore.exceptions.OutOfStockException;
import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;

@RestController
@RequestMapping("/api/order")
public class OrderController {

  @Autowired
  private OrderService orderService;

  @Description("Get order list for current user.")
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  // public ResponseEntity<Page<Order>> getOrderList(Pageable pageable) {
  public ResponseEntity<ListResponse<Order>> getOrderList(
      @RequestParam(name = "title", required = false) String title,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam(name = "createdAtStart", required = false) LocalDate createdAtStart,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam(name = "createdAtEnd", required = false) LocalDate createdAtEnd) {
    if (createdAtStart == null) {
      createdAtStart = LocalDate.EPOCH;
    }
    if (createdAtEnd == null) {
      createdAtEnd = LocalDate.now();
    }

    User user = AuthService.getRequestUser();
    // Page<Order> orders = orderService.getOrdersByUser(user, pageable);
    if (title == null || title.isEmpty()) {
      List<Order> orders = orderService.getOrdersByUserAndCreatedAtBetween(
          user, createdAtStart, createdAtEnd);
      return ResponseEntity.ok(new ListResponse<>(orders));
    }

    List<Order> orders = orderService.getOrdersByUserAndTitleAndCreatedAtBetween(
        user, title, createdAtStart, createdAtEnd);
    return ResponseEntity.ok(new ListResponse<>(orders));
  }

  @RequestMapping(method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderRequest orderRequest) {

    User user = AuthService.getRequestUser();

    Order order = orderService.placeOrder(user, orderRequest);
    return new ResponseEntity<>(order, HttpStatus.CREATED);
  }

  @ExceptionHandler(OutOfStockException.class)
  public ResponseEntity<OutOfStockErrorResponse> handleOutOfStockOrder(
      OutOfStockException ex, WebRequest request) {

    var errorResponse = OutOfStockErrorResponse.builder()
        .outOfStockItems(ex.getOutOfStockItems())
        .message(ex.getMessage())
        .build();

    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }
}
