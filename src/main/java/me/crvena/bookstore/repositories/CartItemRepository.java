package me.crvena.bookstore.repositories;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import me.crvena.bookstore.models.CartItem;
import me.crvena.bookstore.models.User;

@RepositoryRestResource(collectionResourceRel = "cart", path = "cart")
public interface CartItemRepository extends PagingAndSortingRepository<CartItem, Long> {

  List<CartItem> findByCreator(User creator);

  List<CartItem> findByCreatorId(Long userId);
}
