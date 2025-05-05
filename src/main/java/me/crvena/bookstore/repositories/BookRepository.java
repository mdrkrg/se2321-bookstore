package me.crvena.bookstore.repositories;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.Tag;

@RepositoryRestResource(collectionResourceRel = "book", path = "book")
public interface BookRepository extends PagingAndSortingRepository<Book, Long> {

  Optional<Book> findByTitle(String title);

  List<Book> findByTagsIn(@Param("tags") Set<Tag> tags);
}
