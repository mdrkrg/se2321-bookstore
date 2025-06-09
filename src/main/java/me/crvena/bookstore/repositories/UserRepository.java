package me.crvena.bookstore.repositories;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.dtos.AdminUserStat;
import me.crvena.bookstore.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  @Query("""
      SELECT new me.crvena.bookstore.dtos.AdminUserStat(u, SUM(i.paidPrice))
      FROM OrderItem i
      JOIN i.order o
      JOIN o.creator u
      WHERE o.createdAt BETWEEN :startDate AND :endDate
      GROUP BY u
      ORDER BY SUM(i.paidPrice) DESC, MIN(u.id) ASC
      """)
  Page<AdminUserStat> findUserSpendingStats(
      @Param("startDate") Instant startDate,
      @Param("endDate") Instant endDate,
      Pageable pageable);
}
