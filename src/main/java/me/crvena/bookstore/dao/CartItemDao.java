package me.crvena.bookstore.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.CartItem;
import me.crvena.bookstore.models.User;
import me.crvena.bookstore.repositories.CartItemRepository;

public interface CartItemDao {

  Optional<CartItem> findById(Long id);

  void deleteById(Long id);

  void deleteAll(Iterable<? extends CartItem> entities);

  CartItem save(CartItem cartItem);

  List<CartItem> findByCreatorOrderByIdDesc(User creator);

  Page<CartItem> findByCreatorOrderByIdDesc(User creator, Pageable pageable);

  List<CartItem> findByCreatorIdOrderByIdDesc(Long userId);

  Optional<CartItem> findDistinctCartItemByCreatorAndBook(User creator, Book book);
}

@Repository
@RequiredArgsConstructor
class CartItemDaoImpl implements CartItemDao {

  @Delegate
  @Autowired
  private final CartItemRepository repo;

  @Override
  public CartItem save(CartItem cartItem) {
    return repo.save(cartItem);
  }
}
