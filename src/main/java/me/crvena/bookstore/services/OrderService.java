package me.crvena.bookstore.services;

import me.crvena.bookstore.dtos.OrderRequest;
import me.crvena.bookstore.models.*;
import me.crvena.bookstore.repositories.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import me.crvena.bookstore.exceptions.PermissionDenied;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
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
    return orderRepository.findByCreatorOrderByIdDesc(user, pageable);
  }

  public List<Order> getOrdersByUser(User user) {
    return orderRepository.findByCreatorOrderByIdDesc(user);
  }

  /**
   * Places order
   *
   * @throws CartItemDoesNotExistException
   */
  @Transactional
  public Order placeOrder(User user, OrderRequest orderRequest) {
    // validate items
    Set<OrderRequest.Item> requestCartItems = orderRequest.getItems();
    Map<CartItem, BigDecimal> existingCartItems = new HashMap<>();
    requestCartItems.forEach(entry -> {
      CartItem item = cartItemRepository.findById(entry.getItemId())
          .orElseThrow(() -> new ResourceDoesNotExist(
              CartItem.class, entry.getItemId()));
      if (!item.getCreator().equals(user)) {
        throw new PermissionDenied(
            user, "CartItem " + entry.getItemId() + " does not belong to this user.");
      }
      existingCartItems.put(item, entry.getPaidPrice());
    });

    Order order = createFromOrderRequest(user, orderRequest, existingCartItems);

    orderRepository.save(order);
    // WARN: does it save the order again?
    orderItemRepository.saveAll(order.getItems());

    cartItemRepository.deleteAll(existingCartItems.keySet());

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
      User creator, OrderRequest orderRequest, Map<CartItem, BigDecimal> cartItems) {
    Set<OrderItem> orderItems = new HashSet<>();
    Order order = Order.builder()
        .items(orderItems)
        .creator(creator)
        .receiver(orderRequest.getReceiver())
        .tel(orderRequest.getTel())
        .address(orderRequest.getAddress())
        .build();

    Set<OrderRequest.Item> requestCartItems = orderRequest.getItems();
    for (var item : cartItems.entrySet()) {
      OrderItem orderItem = OrderItem.createFromCartItem(
          order, item.getKey(), item.getValue());
      orderItems.add(orderItem);
    }
    return order;
  }
}
