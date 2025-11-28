package me.crvena.bookstore.repositories;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.Tag;

@Repository
public interface BookRepository extends PagingAndSortingRepository<Book, Long>, CrudRepository<Book, Long> {

  Page<Book> findAll(Pageable pageable);

  List<Book> findByAvailable(boolean available);

  @Cacheable(value = "books")
  Page<Book> findByAvailable(boolean available, Pageable pageable);

  @Cacheable(value = "book", key = "#id", unless = "#result == null")
  Optional<Book> findByIdAndAvailable(Long id, boolean available);

  Optional<Book> findByTitle(String title);

  Optional<Book> findByTitleAndAuthor(String title, String author);

  Page<Book> findByTitleIgnoreCaseContaining(String partialTitle, Pageable pageable);

  List<Book> findByAvailableAndTitleIgnoreCaseContaining(boolean available, String partialTitle);

  Page<Book> findByAvailableAndTitleIgnoreCaseContaining(boolean available, String partialTitle,
      Pageable pageable);

  List<Book> findByAvailableAndTitleIgnoreCaseContainingAndTags_IdIn(
      boolean available, String partialTitle, Collection<Long> tagIds);

  Page<Book> findByAvailableAndTitleIgnoreCaseContainingAndTags_IdIn(
      boolean available, String partialTitle, Collection<Long> tagIds, Pageable pageable);

  List<Book> findByAvailableAndTags_IdIn(boolean available, Collection<Long> tagIds);

  Page<Book> findByAvailableAndTags_IdIn(boolean available, Collection<Long> tagIds, Pageable pageable);

  boolean existsByTitleAndAuthor(String title, String author);

  List<Book> findByTagsIn(@Param("tags") Set<Tag> tags);

  List<Book> findByTags_NameIn(@Param("tags") Set<String> tagNames);
}

@Repository
@Primary
@RequiredArgsConstructor
class CachingBookRepository implements BookRepository {

  @Delegate
  @Qualifier("bookRepository")
  @Autowired
  private final BookRepository repo;
  private final Logger logger = LoggerFactory.getLogger(CachingBookRepository.class);

  @Override
  public Page<Book> findByAvailable(boolean available, Pageable pageable) {
    logger.info("CACHE MISS! Fetching books from the database.");
    return repo.findByAvailable(available, pageable);
  }

  @Override
  public Optional<Book> findByIdAndAvailable(Long id, boolean available) {
    logger.info("CACHE MISS! Fetching book #{} from the database.", id);
    return repo.findByIdAndAvailable(id, available);
  }
}
