package me.crvena.bookstore.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

  List<Order> findByCreatorOrderByIdDesc(User creator);

  Page<Order> findByCreatorOrderByIdDesc(User creator, Pageable pageable);
}
