package me.crvena.bookstore.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import me.crvena.bookstore.services.BookService;
import me.crvena.bookstore.dao.BookDao;
import me.crvena.bookstore.dtos.CreateBookRequest;
import me.crvena.bookstore.dtos.ListResponse;
import me.crvena.bookstore.dtos.ModifyBookRequest;
import me.crvena.bookstore.exceptions.ResourceDoesNotExist;
import me.crvena.bookstore.models.Book;

@RestController
@RequestMapping("/api/admin/book")
public class AdminBookController {

  @Autowired
  private BookDao dao;

  @Autowired
  private BookService service;

  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<ListResponse<Book>> findAll() {
    // TODO: paged
    var books = dao.findAll();
    List<Book> bookList = new ArrayList<>();
    books.iterator().forEachRemaining(bookList::add);
    return ResponseEntity.ok(new ListResponse<>(bookList));
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<Book> findOneBook(@PathVariable("id") Long id) {
    Book book = dao.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Book.class, id));
    return ResponseEntity.ok(book);
  }

  @RequestMapping(method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<Book> createBook(@Valid @RequestBody CreateBookRequest data) {
    return ResponseEntity.ok(service.createBook(data));
  }

  @RequestMapping(path = "/{id}", method = { RequestMethod.PUT, RequestMethod.PATCH }, produces = "application/json")
  public ResponseEntity<Book> modifyBook(
      @PathVariable("id") Long id, @Valid @RequestBody ModifyBookRequest data) {
    Book book = dao.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Book.class, id));
    try {
      book = service.modifyBook(book, data);
      return ResponseEntity.ok(book);
    } catch (RuntimeException e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.DELETE, produces = "application/json")
  public ResponseEntity<Book> deleteBook(@PathVariable("id") Long id) {
    Book book = dao.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Book.class, id));
    return ResponseEntity.ok(service.changeAvailable(book, Boolean.FALSE));
  }
}
