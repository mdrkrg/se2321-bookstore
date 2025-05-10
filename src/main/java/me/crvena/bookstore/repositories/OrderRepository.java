package me.crvena.bookstore.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;

@RepositoryRestResource(collectionResourceRel = "order", path = "order")
public interface OrderRepository extends
    PagingAndSortingRepository<Order, Long>,
    CrudRepository<Order, Long> {

  Page<Order> findByCreator(User creator, Pageable pageable);
}
