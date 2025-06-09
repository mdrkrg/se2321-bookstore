package me.crvena.bookstore.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import me.crvena.bookstore.dao.BookDao;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import me.crvena.bookstore.models.Book;

@RestController
@RequestMapping("/api/book")
public class BookController {

  @Autowired
  private BookDao dao;

  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<ListResponse<Book>> findAll(
      @RequestParam @Valid @Min(0) @NotNull Integer pageNumber,
      @RequestParam @Valid @Min(1) @NotNull Integer pageSize,
      // public ResponseEntity<ListResponse<Book>> findAll(
      @RequestParam(name = "title", required = false) String title,
      @RequestParam(name = "tagIds", required = false) @Valid List<Long> tagIds) {
    // TODO: too complicated logic
    Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id"));
    var titleProvided = title != null && !title.isEmpty();
    var tagsProvided = tagIds != null && !tagIds.isEmpty();
    if (titleProvided && tagsProvided) {
      return ResponseEntity.ok(
          ListResponse.of(
              dao.findByAvailableAndTitleIgnoreCaseContainingAndTags_IdIn(
                  true, title, tagIds, pageable)));
    } else if (titleProvided && !tagsProvided) {
      return ResponseEntity.ok(
          ListResponse.of(
              dao.findByAvailableAndTitleIgnoreCaseContaining(
                  true, title, pageable)));
    } else if (!titleProvided && tagsProvided) {
      return ResponseEntity.ok(
          ListResponse.of(
              dao.findByAvailableAndTags_IdIn(true, tagIds, pageable)));
    } else {
      return ResponseEntity.ok(
          ListResponse.of(
              dao.findByAvailable(true, pageable)));
    }
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<Book> findOneBook(@PathVariable("id") Long id) {
    Book book = dao.findByIdAndAvailable(id, true).orElseThrow(
        () -> new ResourceDoesNotExist(Book.class, id));
    return ResponseEntity.ok(book);
  }
}
