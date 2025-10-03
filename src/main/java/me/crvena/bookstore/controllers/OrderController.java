package me.crvena.bookstore.controllers;

import java.time.LocalDate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
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
import me.crvena.bookstore.dtos.OrderAccepted;
import me.crvena.bookstore.dtos.OrderDto;
import me.crvena.bookstore.dtos.OrderRequest;
import me.crvena.bookstore.dtos.OutOfStockErrorResponse;
import me.crvena.bookstore.dtos.PlaceOrderWrapper;
import me.crvena.bookstore.exceptions.OutOfStockException;
import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;

@RestController
@RequestMapping("/api/order")
public class OrderController {

  private Logger logger = LoggerFactory.getLogger(OrderController.class);

  @Autowired
  private KafkaTemplate<String, Object> kafkaTemplate;

  @Autowired
  private OrderService orderService;

  @Description("Get order list for current user.")
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<ListResponse<OrderDto>> getOrderList(
      @RequestParam(name = "title", required = false) String title,
      @Valid @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam(name = "createdAtStart", required = false) LocalDate createdAtStart,
      @Valid @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam(name = "createdAtEnd", required = false) LocalDate createdAtEnd,
      Pageable pageable) {
    logger.debug(pageable.toString());
    if (createdAtStart == null) {
      createdAtStart = LocalDate.EPOCH;
    }
    if (createdAtEnd == null) {
      createdAtEnd = LocalDate.now();
    }

    Sort clientSort = pageable.getSort();
    Sort secondarySort = Sort.by("createdAt").descending();
    Sort finalSort = clientSort.and(secondarySort);
    Pageable finalPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), finalSort);
    Page<Order> orderPage;

    User user = AuthService.getRequestUser();
    if (title == null || title.isEmpty()) {
      orderPage = orderService.getOrdersByUserAndCreatedAtBetween(
          user, createdAtStart, createdAtEnd, finalPageable);
    } else {
      orderPage = orderService.getOrdersByUserAndTitleAndCreatedAtBetween(
          user, title, createdAtStart, createdAtEnd, finalPageable);
    }

    Page<OrderDto> dtoPage = orderPage.map(OrderDto::of);
    return ResponseEntity.ok(ListResponse.of(dtoPage));
  }

  @RequestMapping(method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<OrderDto> placeOrder(@Valid @RequestBody OrderRequest orderRequest) {

    User user = AuthService.getRequestUser();

    Order order = orderService.placeOrder(user, orderRequest);
    return new ResponseEntity<>(OrderDto.of(order), HttpStatus.CREATED);
  }

  @RequestMapping(path = "/message", method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<OrderAccepted> placeOrderMessage(@Valid @RequestBody OrderRequest orderRequest) {

    User user = AuthService.getRequestUser();

    var result = new OrderAccepted("Your order is under processing");

    final var wrapper = PlaceOrderWrapper
        .builder()
        .userId(user.getId())
        .orderRequest(orderRequest)
        .build();

    kafkaTemplate.send("order_received", result.messageId(), wrapper);

    return new ResponseEntity<>(result, HttpStatus.ACCEPTED);
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
