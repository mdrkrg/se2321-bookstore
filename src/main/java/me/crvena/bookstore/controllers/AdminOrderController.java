package me.crvena.bookstore.controllers;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import me.crvena.bookstore.services.OrderService;
import me.crvena.bookstore.dao.OrderDao;
import me.crvena.bookstore.dtos.AdminModifyOrderRequest;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.dtos.OrderAdminDto;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import me.crvena.bookstore.models.Order;

@Validated
@RestController
@RequestMapping("/api/admin/order")
public class AdminOrderController {

  private Logger logger = LoggerFactory.getLogger(AdminOrderController.class);

  @Autowired
  private OrderDao dao;

  @Autowired
  private OrderService service;

  /**
   * Show all orders
   */
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<ListResponse<OrderAdminDto>> getOrderList(
      @RequestParam(name = "title", required = false) String title,
      @Valid @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam(name = "createdAtStart", required = false) LocalDate createdAtStart,
      @Valid @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @RequestParam(name = "createdAtEnd", required = false) LocalDate createdAtEnd,
      Pageable pageable) {
    // TODO: paging
    logger.info(pageable.toString());
    if (createdAtStart == null) {
      createdAtStart = LocalDate.EPOCH;
    }
    if (createdAtEnd == null) {
      createdAtEnd = LocalDate.now();
    }
    Page<Order> orderPage;

    if (title == null || title.isEmpty()) {
      orderPage = service.getOrdersByCreatedAtBetween(
          createdAtStart, createdAtEnd, pageable);
    } else {
      orderPage = service.getOrdersByTitleAndCreatedAtBetween(
          title, createdAtStart, createdAtEnd, pageable);
    }

    Page<OrderAdminDto> dtoPage = orderPage.map(OrderAdminDto::of);
    return ResponseEntity.ok(ListResponse.of(dtoPage));
    // if (title == null || title.isEmpty()) {
    // List<OrderAdminDto> orders = service.getOrdersByCreatedAtBetween(
    // createdAtStart, createdAtEnd).stream().map(OrderAdminDto::of).toList();
    // return ResponseEntity.ok(new ListResponse<>(orders));
    // }

    // List<OrderAdminDto> orders = service.getOrdersByTitleAndCreatedAtBetween(
    // title, createdAtStart,
    // createdAtEnd).stream().map(OrderAdminDto::of).toList();
    // return ResponseEntity.ok(new ListResponse<>(orders));
  }

  /**
   * Show a specific order by their id.
   */
  @RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<OrderAdminDto> findOneOrder(@PathVariable("id") Long id) {
    Order order = dao.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Order.class, id));
    return ResponseEntity.ok(OrderAdminDto.of(order));
  }

  @RequestMapping(path = "/{id}", method = { RequestMethod.PUT,
      RequestMethod.PATCH }, produces = "application/json")
  public ResponseEntity<OrderAdminDto> modifyOrder(
      @PathVariable("id") Long id, @Valid @RequestBody AdminModifyOrderRequest data) {
    Order order = dao.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Order.class, id));
    try {
      order = service.modifyOrder(order, data);
      return ResponseEntity.ok(OrderAdminDto.of(order));
    } catch (RuntimeException e) {
      return ResponseEntity.internalServerError().build();
    }
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
  public ResponseEntity<?> deleteOrder(@PathVariable("id") Long id) {
    Order order = dao.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Order.class, id));
    dao.delete(order);
    return ResponseEntity.noContent().build();
  }
}
