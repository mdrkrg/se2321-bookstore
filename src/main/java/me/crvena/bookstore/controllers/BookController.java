package me.crvena.bookstore.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import me.crvena.bookstore.repositories.BookRepository;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import me.crvena.bookstore.models.Book;

@RestController
@RequestMapping("/api/book")
public class BookController {

  @Autowired
  private BookRepository bookRepository;

  @RestResource(rel = "book")
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  // public ResponseEntity<Page<Book>> findAll(Pageable pageable) {
  public ResponseEntity<ListResponse<Book>> findAll(
      @RequestParam(name = "title", required = false) String title,
      @RequestParam(name = "tagIds", required = false) @Valid List<Long> tagIds) {
    // TODO: too complicated logic
    var titleProvided = title != null && !title.isEmpty();
    var tagsProvided = tagIds != null && !tagIds.isEmpty();
    if (titleProvided && tagsProvided) {
      return ResponseEntity.ok(
          new ListResponse<>(bookRepository.findByAvailableAndTitleIgnoreCaseContainingAndTags_IdIn(
              true, title, tagIds)));
    } else if (titleProvided && !tagsProvided) {
      return ResponseEntity.ok(
          new ListResponse<>(bookRepository.findByAvailableAndTitleIgnoreCaseContaining(
              true, title)));
    } else if (!titleProvided && tagsProvided) {
      return ResponseEntity.ok(
          new ListResponse<>(bookRepository.findByAvailableAndTags_IdIn(true, tagIds)));
    } else {
      return ResponseEntity.ok(
          new ListResponse<>(bookRepository.findByAvailable(true)));
    }
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<Book> findOneBook(@PathVariable("id") Long id) {
    Book book = bookRepository.findByIdAndAvailable(id, true).orElseThrow(
        () -> new ResourceDoesNotExist(Book.class, id));
    return ResponseEntity.ok(book);
  }
}
