package me.crvena.bookstore.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.CartItem;
import me.crvena.bookstore.models.User;

@RepositoryRestResource(collectionResourceRel = "cart", path = "cart")
public interface CartItemRepository extends PagingAndSortingRepository<CartItem, Long>, CrudRepository<CartItem, Long> {

  Page<CartItem> findByCreator(User creator, Pageable pageable);

  List<CartItem> findByCreatorId(Long userId);

  Optional<CartItem> findDistinctCartItemByCreatorAndBook(User creator, Book book);

}
