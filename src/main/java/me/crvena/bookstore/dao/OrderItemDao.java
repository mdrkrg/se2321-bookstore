package me.crvena.bookstore.dao;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import me.crvena.bookstore.dtos.BookSalesStat;
import me.crvena.bookstore.models.OrderItem;
import me.crvena.bookstore.repositories.OrderItemRepository;

public interface OrderItemDao {

  public Page<BookSalesStat> findBestSellingBooks(
      Instant startDate, Instant endDate, Pageable pageable);

  public Page<BookSalesStat> findBestSellingBooks(Pageable pageable);

  public OrderItem save(OrderItem item);

}

@Repository
@RequiredArgsConstructor
class OrderItemDaoImpl implements OrderItemDao {

  @Delegate
  @Autowired
  private final OrderItemRepository repo;

  @Value("${hw2.order-item-dao-exception-enabled:false}")
  private Boolean exception;

  // @Transactional(propagation = Propagation.REQUIRED)
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public OrderItem save(OrderItem item) {
    if (exception) {
      throw new RuntimeException("OrderItemDao exception");
    }
    return repo.save(item);
  }

}
