package me.crvena.bookstore.repositories;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.OrderItem;

@RepositoryRestResource(collectionResourceRel = "cart", path = "cart")
public interface OrderItemRepository extends PagingAndSortingRepository<OrderItem, Long> {

  List<OrderItem> findByOrder(Order order);

  List<OrderItem> findByOrderId(Long orderId);
}
