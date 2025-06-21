package me.crvena.bookstore.controllers;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

  private final Logger logger = LoggerFactory.getLogger(AdminBookController.class);

  @Autowired
  private BookDao dao;

  @Autowired
  private BookService service;

  @RequestMapping(method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<ListResponse<Book>> findAll(
      @RequestParam(name = "title", required = false) String title,
      Pageable pageable) {
    Sort clientSort = pageable.getSort();
    Sort secondarySort = Sort.by("id").ascending();
    Sort finalSort = clientSort.and(secondarySort);
    Pageable finalPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), finalSort);
    Page<Book> bookPage;

    if (title == null || title.isEmpty()) {
      bookPage = dao.findAll(finalPageable);
    } else {
      bookPage = dao.findByTitleIgnoreCaseContaining(title, finalPageable);
    }
    return ResponseEntity.ok(ListResponse.of(bookPage));
  }

  @RequestMapping(path = "/{id}", method = RequestMethod.GET, produces = "application/json")
  public ResponseEntity<Book> findOneBook(@PathVariable("id") Long id) {
    Book book = dao.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Book.class, id));
    return ResponseEntity.ok(book);
  }

  @RequestMapping(method = RequestMethod.POST, produces = "application/json")
  public ResponseEntity<Book> createBook(
      @Valid @RequestPart("data") CreateBookRequest data,
      @RequestParam(value = "coverFile", required = false) MultipartFile coverFile) {
    return ResponseEntity.ok(service.createBook(data, coverFile));
  }

  @RequestMapping(path = "/{id}", method = { RequestMethod.PUT, RequestMethod.PATCH }, produces = "application/json")
  public ResponseEntity<Book> modifyBook(
      @PathVariable("id") Long id,
      @Valid @RequestPart("data") ModifyBookRequest data,
      @RequestParam(value = "newCoverFile", required = false) MultipartFile newCoverFile) {
    logger.info("modifying book: " + id);
    logger.debug(data.toString());
    Book book = dao.findById(id).orElseThrow(
        () -> new ResourceDoesNotExist(Book.class, id));
    try {
      book = service.modifyBook(book, data, newCoverFile);
      return ResponseEntity.ok(book);
    } catch (RuntimeException e) {
      logger.error("Error in modifyBook: " + e.getMessage());
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
