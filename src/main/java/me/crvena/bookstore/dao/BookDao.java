package me.crvena.bookstore.dao;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.Tag;
import me.crvena.bookstore.repositories.BookRepository;

public interface BookDao {

  public Iterable<Book> findAll();

  public Iterable<Book> findAll(Sort sort);

  public Page<Book> findAll(Pageable pageable);

  public Optional<Book> findById(Long id);

  public Book save(Book book);

  public Iterable<Book> saveAll(Iterable<Book> books);

  public List<Book> findByAvailable(boolean available);

  public Page<Book> findByAvailable(boolean available, Pageable pageable);

  public Optional<Book> findByIdAndAvailable(Long id, boolean available);

  public Optional<Book> findByTitle(String title);

  public Optional<Book> findByTitleAndAuthor(String title, String author);

  public List<Book> findByAvailableAndTitleIgnoreCaseContaining(boolean available, String partialTitle);

  public Page<Book> findByAvailableAndTitleIgnoreCaseContaining(boolean available, String partialTitle,
      Pageable pageable);

  public List<Book> findByAvailableAndTitleIgnoreCaseContainingAndTags_IdIn(
      boolean available, String partialTitle, Collection<Long> tagIds);

  public Page<Book> findByAvailableAndTitleIgnoreCaseContainingAndTags_IdIn(
      boolean available, String partialTitle, Collection<Long> tagIds, Pageable pageable);

  public List<Book> findByAvailableAndTags_IdIn(boolean available, Collection<Long> tagIds);

  public Page<Book> findByAvailableAndTags_IdIn(boolean available, Collection<Long> tagIds, Pageable pageable);

  public boolean existsByTitleAndAuthor(String title, String author);

  public List<Book> findByTagsIn(@Param("tags") Set<Tag> tags);
}

@Repository
@RequiredArgsConstructor
class BookDaoImpl implements BookDao {

  @Delegate
  @Autowired
  private final BookRepository repo;

  // override conflict
  @Override
  public Iterable<Book> saveAll(Iterable<Book> books) {
    return repo.saveAll(books);
  }

  @Override
  public Book save(Book book) {
    return repo.save(book);
  }
}
