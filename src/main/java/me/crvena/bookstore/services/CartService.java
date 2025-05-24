package me.crvena.bookstore.services;

import me.crvena.bookstore.models.*;
import me.crvena.bookstore.repositories.*;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import me.crvena.bookstore.exceptions.ConflictExceptions.CartItemAlreadyExist;
import me.crvena.bookstore.exceptions.PermissionDenied;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import jakarta.transaction.Transactional;
import lombok.*;

@Service
public interface CartService {

  public List<CartItem> getCartByUser(User user);

  public Page<CartItem> getCartByUser(User user, Pageable pageable);

  public Optional<CartItem> getCartItemByUserAndBookId(User user, Long bookId);

  /**
   * @throw {@link CartItemAlreadyExist}
   */
  @Transactional
  public CartItem createCartItem(User user, Long bookId, Long number);

  /**
   * @throw {@link ResourceDoesNotExist}
   * @throw {@link PermissionDenied}
   */
  @Transactional
  public CartItem modifyCartItem(Long id, Long number, User user)
      throws PermissionDenied, ResourceDoesNotExist;

  /**
   * @throw {@link ResourceDoesNotExist}
   * @throw {@link PermissionDenied}
   */
  @Transactional
  public void deleteCartItem(Long id, User user)
      throws PermissionDenied, ResourceDoesNotExist;
}

@Service
@RequiredArgsConstructor
class CartServiceImpl implements CartService {

  @Autowired
  private final CartItemRepository cartItemRepository;

  @Autowired
  private final BookRepository bookRepository;

  public List<CartItem> getCartByUser(User user) {
    return cartItemRepository.findByCreatorOrderByIdDesc(user);
  }

  public Page<CartItem> getCartByUser(User user, Pageable pageable) {
    return cartItemRepository.findByCreatorOrderByIdDesc(user, pageable);
  }

  public Optional<CartItem> getCartItemByUserAndBookId(User user, Long bookId) {
    Book book = bookRepository.findById(bookId)
        .orElseThrow(() -> new ResourceDoesNotExist(Book.class, bookId));
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
      throw new CartItemAlreadyExist("Cart item already exists for user and book");
    }
    CartItem cartItem = CartItem.builder()
        .creator(user).book(book).number(number).build();
    return cartItemRepository.save(cartItem);
  }

  /**
   * @throw {@link ResourceDoesNotExist}
   */
  @Transactional
  public CartItem modifyCartItem(Long id, Long number, User user) {
    CartItem cartItem = cartItemRepository.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(CartItem.class, id));

    if (!cartItem.getCreator().equals(user)) {
      throw new PermissionDenied(user);
    }

    cartItem.setNumber(number);
    return cartItemRepository.save(cartItem);
  }

  /**
   * @throw {@link ResourceDoesNotExist}
   */
  @Transactional
  public void deleteCartItem(Long id, User user) {
    CartItem cartItem = cartItemRepository.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(CartItem.class, id));

    if (!cartItem.getCreator().equals(user)) {
      throw new PermissionDenied(user);
    }

    cartItemRepository.deleteById(id);
  }
}
