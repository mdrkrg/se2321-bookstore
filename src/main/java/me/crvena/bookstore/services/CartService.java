package me.crvena.bookstore.services;

import me.crvena.bookstore.models.*;
import me.crvena.bookstore.repositories.*;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.*;

@Service
@RequiredArgsConstructor
public class CartService {

  @Autowired
  private final CartItemRepository cartItemRepository;

  public Page<CartItem> getCartByUser(User user, Pageable pageable) {
    return cartItemRepository.findByCreator(user, pageable);
  }

  public Optional<CartItem> getCartItemByUserBook(User user, Book book) {
    return cartItemRepository.findDistinctCartItemByCreatorAndBook(user, book);
  }

  @Transactional
  public CartItem createCartItem(User user, Book book, Long number) {
    CartItem cartItem = new CartItem(user, book, number);
    return cartItemRepository.save(cartItem);
  }
}
