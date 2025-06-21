package me.crvena.bookstore.dao;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;
import me.crvena.bookstore.repositories.OrderRepository;

public interface OrderDao {

  public List<Order> findAll();

  public Optional<Order> findById(Long id);

  public Order save(Order order);

  public void delete(Order order);

  public List<Order> findByCreatorOrderByIdDesc(User creator);

  public Page<Order> findByCreatorOrderByIdDesc(User creator, Pageable pageable);

  public List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(
      Instant createdAtStart, Instant createdAtEnd);

  public Page<Order> findByCreatedAtBetween(
      Instant createdAtStart, Instant createdAtEnd, Pageable pageable);

  public List<Order> findByTitleIgnoreCaseAndCreatedAtBetweenOrderByCreatedAtDesc(
      String title, Instant createdAtStart, Instant createdAtEnd);

  public Page<Order> findByTitleIgnoreCaseAndCreatedAtBetween(
      String title, Instant createdAtStart, Instant createdAtEnd, Pageable pageable);

  public List<Order> findByCreatorAndCreatedAtBetweenOrderByCreatedAtDesc(
      User creator, Instant createdAtStart, Instant createdAtEnd);

  public Page<Order> findByCreatorAndCreatedAtBetweenOrderByCreatedAtDesc(
      User creator, Instant createdAtStart, Instant createdAtEnd, Pageable pageable);

  public List<Order> findByCreatorAndBookTitle(
      User creator, String bookTitle);

  public Page<Order> findByCreatorAndBookTitle(
      User creator,
      String bookTitle,
      Pageable pageable);

  public List<Order> findByCreatorAndBookTitleAndCreatedAtBetween(
      User creator,
      String bookTitle,
      Instant createdAtStart,
      Instant createdAtEnd);

  public Page<Order> findByCreatorAndBookTitleAndCreatedAtBetween(
      User creator,
      String bookTitle,
      Instant createdAtStart,
      Instant createdAtEnd,
      Pageable pageable);

}

@Repository
@RequiredArgsConstructor
class OrderDaoImpl implements OrderDao {

  @Delegate
  @Autowired
  private final OrderRepository repo;

  @Override
  public Page<Order> findByCreatedAtBetween(
      Instant createdAtStart, Instant createdAtEnd, Pageable pageable) {
    return repo.findByCreatedAtBetween(
        createdAtStart, createdAtEnd, pageable);
  }

  @Override
  public Order save(Order order) {
    return repo.save(order);
  }
}
