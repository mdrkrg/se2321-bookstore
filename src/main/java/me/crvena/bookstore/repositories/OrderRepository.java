package me.crvena.bookstore.repositories;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

  List<Order> findByCreatorOrderByIdDesc(User creator);

  Page<Order> findByCreatorOrderByIdDesc(User creator, Pageable pageable);

  List<Order> findByCreatorIdOrderByIdDesc(Long creatorId);

  List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(
      Instant createdAtStart, Instant createdAtEnd);

  Page<Order> findByCreatedAtBetween(
      Instant createdAtStart, Instant createdAtEnd, Pageable pageable);

  List<Order> findByCreatorAndCreatedAtBetweenOrderByCreatedAtDesc(
      User creator, Instant createdAtStart, Instant createdAtEnd);

  Page<Order> findByCreatorAndCreatedAtBetween(
      User creator, Instant createdAtStart, Instant createdAtEnd, Pageable pageable);

  static final String FILTER_CREATOR_TITLE_QUERY = """
      SELECT DISTINCT o
      FROM Order o
      JOIN o.items i
      JOIN i.book b
      WHERE o.creator = :creator
        AND LOWER(b.title) LIKE LOWER(CONCAT('%', :bookTitle, '%'))
      """;

  @Query(FILTER_CREATOR_TITLE_QUERY + """
        ORDER BY o.createdAt DESC
      """)
  List<Order> findByCreatorAndBookTitle(
      @Param("creator") User creator, @Param("bookTitle") String bookTitle);

  @Query(FILTER_CREATOR_TITLE_QUERY)
  Page<Order> findByCreatorAndBookTitle(
      @Param("creator") User creator,
      @Param("bookTitle") String bookTitle,
      Pageable pageable);

  static final String FILTER_CREATOR_TITLE_DATE_QUERY = """
      SELECT DISTINCT o
      FROM Order o
      JOIN o.items i
      JOIN i.book b
      WHERE o.creator = :creator
        AND LOWER(b.title) LIKE LOWER(CONCAT('%', :bookTitle, '%'))
        AND o.createdAt BETWEEN :createdAtStart AND :createdAtEnd
      """;

  @Query(FILTER_CREATOR_TITLE_DATE_QUERY + """
      ORDER BY o.createdAt DESC
      """)
  List<Order> findByCreatorAndBookTitleAndCreatedAtBetween(
      @Param("creator") User creator,
      @Param("bookTitle") String bookTitle,
      @Param("createdAtStart") Instant createdAtStart,
      @Param("createdAtEnd") Instant createdAtEnd);

  @Query(FILTER_CREATOR_TITLE_DATE_QUERY)
  Page<Order> findByCreatorAndBookTitleAndCreatedAtBetween(
      @Param("creator") User creator,
      @Param("bookTitle") String bookTitle,
      @Param("createdAtStart") Instant createdAtStart,
      @Param("createdAtEnd") Instant createdAtEnd,
      Pageable pageable);

  static final String FILTER_TITLE_DATE_QUERY = """
      SELECT DISTINCT o
      FROM Order o
      JOIN o.items i
      JOIN i.book b
      WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :bookTitle, '%'))
        AND o.createdAt BETWEEN :createdAtStart AND :createdAtEnd
      ORDER BY o.createdAt DESC
      """;

  @Query(FILTER_TITLE_DATE_QUERY)
  List<Order> findByTitleIgnoreCaseAndCreatedAtBetweenOrderByCreatedAtDesc(
      @Param("bookTitle") String bookTitle,
      @Param("createdAtStart") Instant createdAtStart,
      @Param("createdAtEnd") Instant createdAtEnd);

  @Query(FILTER_TITLE_DATE_QUERY)
  Page<Order> findByTitleIgnoreCaseAndCreatedAtBetween(
      @Param("bookTitle") String bookTitle,
      @Param("createdAtStart") Instant createdAtStart,
      @Param("createdAtEnd") Instant createdAtEnd,
      Pageable pageable);
}
