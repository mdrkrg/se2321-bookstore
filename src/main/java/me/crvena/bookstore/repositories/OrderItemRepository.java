package me.crvena.bookstore.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

  List<OrderItem> findByOrder(Order order);

  List<OrderItem> findByOrderId(Long orderId);
}
