package me.crvena.bookstore.services;

import me.crvena.bookstore.dtos.OrderRequest;
import me.crvena.bookstore.exceptions.ResourceDoesNotExistException;
import me.crvena.bookstore.models.*;
import me.crvena.bookstore.repositories.*;

import java.util.HashSet;
import java.util.Set;

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
   *
   * @throws CartItemDoesNotExistException
   */
  @Transactional
  public Order placeOrder(User user, OrderRequest orderRequest) {
    // validate item ids
    Set<Long> cartItemIds = orderRequest.getItemIds();
    Set<CartItem> cartItems = new HashSet<>();
    cartItemIds.forEach(id -> {
      cartItems.add(cartItemRepository.findById(id)
          .orElseThrow(() -> new ResourceDoesNotExistException(
              CartItem.class, id)));
    });

    Order order = createFromOrderRequest(user, orderRequest, cartItems);

    orderRepository.save(order);
    // WARN: does it save the order again?
    orderItemRepository.saveAll(order.getItems());

    cartItemRepository.deleteAll(cartItems);

    return order;
  }

  /**
   * Create an Order from an {@link OrderRequest}.
   * Will initilaize a set of {@link OrderItem} from {@link CartItem}s in
   * orderRequest.
   *
   * @param creator      The creator of the order.
   * @param orderRequest {@link OrderRequest} body.
   * @param cartItems    cartItems.
   */
  private static Order createFromOrderRequest(
      User creator, OrderRequest orderRequest, Set<CartItem> cartItems) {
    Set<OrderItem> orderItems = new HashSet<>();
    Order order = new Order(
        orderItems, creator, orderRequest.getRecevier(), orderRequest.getTel(), orderRequest.getAddress());

    for (CartItem item : cartItems) {
      OrderItem orderItem = OrderItem.createFromCartItem(
          order, item, orderRequest.getPaidPrice());
      orderItems.add(orderItem);
    }
    return order;
  }
}
