package me.crvena.bookstore.repositories;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;

@RepositoryRestResource(collectionResourceRel = "cart", path = "cart")
public interface OrderRepository extends PagingAndSortingRepository<Order, Long> {

  List<Order> findByCreatedBy(User createdBy);
}
