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
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import me.crvena.bookstore.models.Book;

@RestController
@RequestMapping("/api/book")
// @CrossOrigin(origins = "http://localhost:3000")
public class BookController {

  @Autowired
  private BookRepository bookRepository;

  @Description("Get cart for current user.")
  @RestResource(rel = "book")
  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<Page<Book>> findAll(Pageable pageable) {
    return ResponseEntity.ok(bookRepository.findAll(pageable));
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<Book> findOneBook(@PathVariable("id") Long id) {
    Book book = bookRepository.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Book.class, id));
    return ResponseEntity.ok(book);
  }
}
