package me.crvena.bookstore.services;

import me.crvena.bookstore.models.*;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import me.crvena.bookstore.dao.BookDao;
import me.crvena.bookstore.dao.OrderItemDao;
import me.crvena.bookstore.dao.TagDao;
import me.crvena.bookstore.dtos.BookSalesStat;
import me.crvena.bookstore.dtos.CreateBookRequest;
import me.crvena.bookstore.dtos.ModifyBookRequest;
import me.crvena.bookstore.exceptions.ConflictExceptions.ResourceAlreadyExist;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import jakarta.transaction.Transactional;
import lombok.*;

@Service
public interface BookService {

  public Page<BookSalesStat> getTopSellingBooks(
      LocalDate startDate, LocalDate endDate, Pageable pageable);

  public Page<BookSalesStat> getTopSellingBooks(Pageable pageable);

  @Caching(evict = { @CacheEvict(value = "books", allEntries = true) }, put = {
      @CachePut(value = "book", key = "#bookId") })
  public Book addBookTag(Long bookId, Long tagId);

  @Caching(evict = { @CacheEvict(value = "books", allEntries = true) }, put = {
      @CachePut(value = "book", key = "#bookId") })
  public Book removeBookTag(Long bookId, Long tagId);

  @Caching(evict = { @CacheEvict(value = "books", allEntries = true) }, put = {
      @CachePut(value = "book", key = "#book.id") })
  public Book modifyBook(Book book, ModifyBookRequest data, MultipartFile newCoverFile)
      throws RuntimeException;

  @CacheEvict(value = "books", allEntries = true)
  public Book createBook(CreateBookRequest data, MultipartFile newCoverFile)
      throws RuntimeException, ResourceAlreadyExist;

  @Caching(evict = { @CacheEvict(value = "books", allEntries = true) }, put = {
      @CachePut(value = "book", key = "#book.id") })
  public Book changeAvailable(Book book, Boolean available);

  public Page<Book> findBooksByTitleAndTags(String title, List<Long> tagIds, Pageable pageable);
}

@Service
@RequiredArgsConstructor
class BookServiceImpl implements BookService {

  private final Logger logger = LoggerFactory.getLogger(BookService.class);

  @Autowired
  private BookDao dao;

  @Autowired
  private TagDao tagDao;

  @Autowired
  private OrderItemDao orderItemDao;

  @Autowired
  private FileStorageService fileStorageService;

  @Autowired
  private ObjectMapper mapper;

  public Book addBookTag(Long bookId, Long tagId) {
    return null;
  }

  public Book removeBookTag(Long bookId, Long tagId) {
    return null;
  }

  @Transactional
  public Page<BookSalesStat> getTopSellingBooks(Pageable pageable) {
    return orderItemDao.findBestSellingBooks(pageable);
  }

  @Transactional
  public Page<BookSalesStat> getTopSellingBooks(LocalDate startDate, LocalDate endDate, Pageable pageable) {
    Instant startInstant = startDate.atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant endInstant = endDate.atTime(LocalTime.MAX).toInstant(ZoneOffset.UTC);

    return orderItemDao.findBestSellingBooks(startInstant, endInstant, pageable);
  }

  @Transactional
  public Book createBook(CreateBookRequest data, MultipartFile coverFile)
      throws RuntimeException, ResourceAlreadyExist {
    if (dao.existsByTitleAndAuthor(data.getTitle(), data.getAuthor())) {
      throw new ResourceAlreadyExist("book already exist");
    }

    Book book = Book.builder()
        .id(null)
        .title(data.getTitle())
        .author(data.getAuthor())
        .description(data.getDescription())
        .price(data.getPrice())
        // WARN:
        .inventory(BookInventory.builder().stock(data.getStock()).build())
        .build();
    if (coverFile != null && !coverFile.isEmpty()) {
      try {
        String coverUrl = fileStorageService.uploadFile(coverFile);
        book.setCover(coverUrl);
      } catch (IOException e) {
        throw new RuntimeException("Failed to upload new cover image", e);
      }
    }

    var tagIds = data.getTagIds();
    for (var tagId : tagIds) {
      Tag tag = tagDao.findById(tagId).orElseThrow(
          () -> new ResourceDoesNotExist(Tag.class, tagId));
      book.addTag(tag);
    }
    return dao.save(book);
  }

  @Transactional
  public Book modifyBook(Book book, ModifyBookRequest data, MultipartFile newCoverFile) throws RuntimeException {

    String oldCoverUrl = book.getCover();
    String newCoverUrl = oldCoverUrl;
    if (newCoverFile != null && !newCoverFile.isEmpty()) {
      try {
        newCoverUrl = fileStorageService.uploadFile(newCoverFile);
        book.setCover(newCoverUrl);
      } catch (IOException e) {
        throw new RuntimeException("Failed to upload new cover image", e);
      }
    }

    try {
      mapper.updateValue(book, data);
      logger.debug("mapper updated book");
    } catch (JsonMappingException e) {
      throw new RuntimeException(e.getMessage());
    }

    var inventory = book.getInventory();
    if (data.getSales() != null && data.getSales().isPresent()) {
      inventory.setSales(data.getSales().get());
    }
    if (data.getStock() != null && data.getStock().isPresent()) {
      inventory.setStock(data.getStock().get());
    }

    if (data.getTagIds() != null && data.getTagIds().isPresent()) {
      // set tags
      var tagIds = data.getTagIds().get();
      Set<Tag> tags = new HashSet<>();
      for (var tagId : tagIds) {
        Tag tag = tagDao.findById(tagId).orElseThrow(
            () -> new ResourceDoesNotExist(Tag.class, tagId));
        tags.add(tag);
      }
      book.setTags(tags);
    }

    // save
    Book updatedBook = dao.save(book);

    // clean old cover
    boolean coverHasChanged = oldCoverUrl != null && !oldCoverUrl.equals(newCoverUrl);
    if (coverHasChanged) {
      fileStorageService.deleteFile(oldCoverUrl);
    }

    return updatedBook;
  }

  @Transactional
  public Book changeAvailable(Book book, Boolean available) {
    book.setAvailable(available);
    return dao.save(book);
  }

  public Page<Book> findBooksByTitleAndTags(String title, List<Long> tagIds, Pageable pageable) {
    // TODO: too complicated logic
    var titleProvided = title != null && !title.isEmpty();
    var tagsProvided = tagIds != null && !tagIds.isEmpty();
    Page<Book> bookPage;
    if (titleProvided && tagsProvided) {
      bookPage = dao.findByAvailableAndTitleIgnoreCaseContainingAndTags_IdIn(
          true, title, tagIds, pageable);
    } else if (titleProvided && !tagsProvided) {
      bookPage = dao.findByAvailableAndTitleIgnoreCaseContaining(
          true, title, pageable);
    } else if (!titleProvided && tagsProvided) {
      bookPage = dao.findByAvailableAndTags_IdIn(true, tagIds, pageable);
    } else {
      bookPage = dao.findByAvailable(true, pageable);
    }
    return bookPage;
  }
}
