package me.crvena.bookstore.services;

import me.crvena.bookstore.dtos.OrderRequest;
import me.crvena.bookstore.models.*;
import me.crvena.bookstore.repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.*;

@Service
@RequiredArgsConstructor
public class OrderService {

  @Autowired
  private final CartItemRepository cartItemRepository;

  @Autowired
  private final OrderItemRepository orderItemRepository;

  @Autowired
  private final OrderRepository orderRepository;

  public Page<Order> getOrdersByUser(User user, Pageable pageable) {
    return orderRepository.findByCreator(user, pageable);
  }

  /**
   * Places order
   */
  @Transactional
  public Order placeOrder(User user, OrderRequest orderRequest) {
    Order order = Order.createFromOrderRequest(user, orderRequest);

    orderRepository.save(order);
    // WARN: does it save the order again?
    orderItemRepository.saveAll(order.getItems());

    cartItemRepository.deleteAll(orderRequest.getItems());

    return order;
  }
}
