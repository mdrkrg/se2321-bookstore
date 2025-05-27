package me.crvena.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.Description;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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
  public ResponseEntity<ListResponse<Book>> findAll() {
    return ResponseEntity.ok(
        new ListResponse<>(bookRepository.findByAvailable(true)));
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<Book> findOneBook(@PathVariable("id") Long id) {
    Book book = bookRepository.findByIdAndAvailable(id, true).orElseThrow(
        () -> new ResourceDoesNotExist(Book.class, id));
    return ResponseEntity.ok(book);
  }
}
