package me.crvena.bookstore.repositories;

import java.util.Optional;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import me.crvena.bookstore.models.Tag;
import me.crvena.bookstore.repositories.utils.ReadonlyRepository;

@RepositoryRestResource(collectionResourceRel = "tag", path = "tag")
public interface TagRepository extends ReadonlyRepository<Tag, Long> {

  Optional<Tag> findByName(String name);
}
