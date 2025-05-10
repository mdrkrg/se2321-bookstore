package me.crvena.bookstore.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.CartItem;
import me.crvena.bookstore.models.User;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

  List<CartItem> findByCreator(User creator);

  Page<CartItem> findByCreator(User creator, Pageable pageable);

  List<CartItem> findByCreatorId(Long userId);

  Optional<CartItem> findDistinctCartItemByCreatorAndBook(User creator, Book book);

}
