package me.crvena.bookstore.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import me.crvena.bookstore.models.Tag;

@RepositoryRestResource(collectionResourceRel = "cart", path = "cart")
public interface TagRepository extends CrudRepository<Tag, Long> {
  Optional<Tag> findByName(String name);
}
