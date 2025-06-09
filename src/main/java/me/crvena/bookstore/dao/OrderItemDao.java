package me.crvena.bookstore.dao;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import me.crvena.bookstore.dtos.BookSalesStat;
import me.crvena.bookstore.repositories.OrderItemRepository;

public interface OrderItemDao {

  public Page<BookSalesStat> findBestSellingBooks(
      Instant startDate, Instant endDate, Pageable pageable);

  public Page<BookSalesStat> findBestSellingBooks(Pageable pageable);

}

@Repository
@RequiredArgsConstructor
class OrderItemDaoImpl implements OrderItemDao {

  @Delegate
  @Autowired
  private final OrderItemRepository repo;

}
