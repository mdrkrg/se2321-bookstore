package me.crvena.bookstore.services;

import me.crvena.bookstore.models.*;
import me.crvena.bookstore.repositories.*;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import me.crvena.bookstore.exceptions.CartItemAlreadyExistsException;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import jakarta.transaction.Transactional;
import lombok.*;

@Service
@RequiredArgsConstructor
public class CartService {

  @Autowired
  private final CartItemRepository cartItemRepository;

  @Autowired
  private final BookRepository bookRepository;

  public List<CartItem> getCartByUser(User user) {
    return cartItemRepository.findByCreator(user);
  }

  public Page<CartItem> getCartByUser(User user, Pageable pageable) {
    return cartItemRepository.findByCreator(user, pageable);
  }

  public Optional<CartItem> getCartItemByUserBook(User user, Book book) {
    return cartItemRepository.findDistinctCartItemByCreatorAndBook(user, book);
  }

  /**
   * @throw CartItemAlreadyExistsException
   */
  @Transactional
  public CartItem createCartItem(User user, Long bookId, Long number) {
    Book book = bookRepository.findById(bookId)
        .orElseThrow(() -> new ResourceDoesNotExist(Book.class, bookId));

    Optional<CartItem> existingCartItem = cartItemRepository.findDistinctCartItemByCreatorAndBook(user, book);
    if (existingCartItem.isPresent()) {
      throw new CartItemAlreadyExistsException("Cart item already exists for user and book");
    }
    CartItem cartItem = new CartItem(user, book, number);
    return cartItemRepository.save(cartItem);
  }

  /**
   * @throw {@link ResourceDoesNotExist}
   */
  @Transactional
  public CartItem modifyCartItem(Long id, Long number) {
    CartItem cartItem = cartItemRepository.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(CartItem.class, id));
    cartItem.setNumber(number);
    return cartItemRepository.save(cartItem);
  }

  /**
   * @throw {@link ResourceDoesNotExist}
   */
  @Transactional
  public void deleteCartItem(Long id) {
    if (!cartItemRepository.existsById(id)) {
      throw new ResourceDoesNotExist(CartItem.class, id);
    }
    cartItemRepository.deleteById(id);
  }
}
