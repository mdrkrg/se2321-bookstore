package me.crvena.bookstore.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import me.crvena.bookstore.services.AuthService;
import me.crvena.bookstore.services.OrderService;
import me.crvena.bookstore.dtos.UserOrderStatResponse;
import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;

@RestController
@RequestMapping("/api/stat")
public class UserStatController {

  @Autowired
  private OrderService orderService;

  @RequestMapping(path = "/order", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<UserOrderStatResponse> getOrderStat(
      @Valid @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam(name = "createdAtStart", required = false) LocalDate createdAtStart,
      @Valid @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam(name = "createdAtEnd", required = false) LocalDate createdAtEnd) {

    if (createdAtStart == null) {
      createdAtStart = LocalDate.EPOCH;
    }
    if (createdAtEnd == null) {
      createdAtEnd = LocalDate.now();
    }

    User user = AuthService.getRequestUser();

    List<Order> orders = orderService.getOrdersByUserAndCreatedAtBetween(
        user, createdAtStart, createdAtEnd);
    return ResponseEntity.ok(new UserOrderStatResponse(orders));
  }
}
