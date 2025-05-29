package me.crvena.bookstore.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.Tag;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

  Page<Book> findAll(Pageable pageable);

  List<Book> findByAvailable(boolean available);

  Optional<Book> findByIdAndAvailable(Long id, boolean available);

  Optional<Book> findByTitle(String title);

  Optional<Book> findByTitleAndAuthor(String title, String author);

  List<Book> findByAvailableAndTitleIgnoreCaseContaining(boolean available, String partialTitle);

  List<Book> findByAvailableAndTitleIgnoreCaseContainingAndTags_IdIn(
      boolean available, String partialTitle, Collection<Long> tagIds);

  List<Book> findByAvailableAndTags_IdIn(boolean available, Collection<Long> tagIds);

  boolean existsByTitleAndAuthor(String title, String author);

  List<Book> findByTagsIn(@Param("tags") Set<Tag> tags);
}
