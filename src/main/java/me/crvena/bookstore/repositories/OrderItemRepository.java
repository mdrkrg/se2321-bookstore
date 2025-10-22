package me.crvena.bookstore.repositories;

import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.dtos.BookSalesStat;
import me.crvena.bookstore.models.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

  /**
   * Finds the best-selling books within a given time range
   * by calculating the total number of sales for each book
   *
   * @param startDate The beginning of the time range (inclusive).
   * @param endDate   The end of the time range (inclusive).
   * @param pageable  pagination
   */
  @Query("""
      SELECT new me.crvena.bookstore.dtos.BookSalesStat(i.book, SUM(i.number))
      FROM OrderItem i
      JOIN i.order o
      WHERE o.createdAt BETWEEN :startDate AND :endDate
      GROUP BY i.book
      ORDER BY SUM(i.number) DESC, MIN(i.book.id) ASC
      """)
  Page<BookSalesStat> findBestSellingBooks(
      @Param("startDate") Instant startDate,
      @Param("endDate") Instant endDate,
      Pageable pageable);

  /**
   * Find best selling book with book.sales
   *
   * @param pageable pagination
   */
  @Query("""
      SELECT new me.crvena.bookstore.dtos.BookSalesStat(b, i.sales)
      FROM Book b JOIN b.inventory i
      ORDER BY i.sales DESC
      """)
  Page<BookSalesStat> findBestSellingBooks(Pageable pageable);
}
