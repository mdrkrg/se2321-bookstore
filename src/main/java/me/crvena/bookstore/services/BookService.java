package me.crvena.bookstore.services;

import me.crvena.bookstore.models.*;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import me.crvena.bookstore.dao.BookDao;
import me.crvena.bookstore.dao.TagDao;
import me.crvena.bookstore.dtos.CreateBookRequest;
import me.crvena.bookstore.dtos.ModifyBookRequest;
import me.crvena.bookstore.exceptions.ConflictExceptions.ResourceAlreadyExist;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import jakarta.transaction.Transactional;
import lombok.*;

@Service
public interface BookService {

  public Book addBookTag(Long bookId, Long tagId);

  public Book removeBookTag(Long bookId, Long tagId);

  public Book modifyBook(Book book, ModifyBookRequest data)
      throws RuntimeException;

  public Book createBook(CreateBookRequest data)
      throws RuntimeException, ResourceAlreadyExist;

  public Book changeAvailable(Book book, Boolean available);

}

@Service
@RequiredArgsConstructor
class BookServiceImpl implements BookService {

  @Autowired
  private BookDao dao;

  @Autowired
  private TagDao tagDao;

  @Autowired
  private ObjectMapper mapper;

  public Book addBookTag(Long bookId, Long tagId) {
    return null;
  }

  public Book removeBookTag(Long bookId, Long tagId) {
    return null;
  }

  @Transactional
  public Book createBook(CreateBookRequest data) throws RuntimeException, ResourceAlreadyExist {
    if (dao.existsByTitleAndAuthor(data.getTitle(), data.getAuthor())) {
      throw new ResourceAlreadyExist("book already exist");
    }
    Book book = Book.builder()
        .id(null)
        .title(data.getTitle())
        .author(data.getAuthor())
        .description(data.getDescription())
        .price(data.getPrice())
        .cover(data.getCover())
        .stock(data.getStock())
        .build();

    var tagIds = data.getTagIds();
    for (var tagId : tagIds) {
      Tag tag = tagDao.findById(tagId).orElseThrow(
          () -> new ResourceDoesNotExist(Tag.class, tagId));
      book.addTag(tag);
    }
    return dao.save(book);
  }

  @Transactional
  public Book modifyBook(Book book, ModifyBookRequest data) throws RuntimeException {
    try {
      mapper.updateValue(book, data);
      if (data.getTagIds().isEmpty()) {
        return dao.save(book);
      }
      var tagIds = data.getTagIds().get();
      Set<Tag> tags = new HashSet<>();
      for (var tagId : tagIds) {
        Tag tag = tagDao.findById(tagId).orElseThrow(
            () -> new ResourceDoesNotExist(Tag.class, tagId));
        tags.add(tag);
      }
      book.setTags(tags);
      return dao.save(book);
    } catch (JsonMappingException e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  @Transactional
  public Book changeAvailable(Book book, Boolean available) {
    book.setAvailable(available);
    return dao.save(book);
  }
}
