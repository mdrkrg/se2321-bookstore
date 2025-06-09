package me.crvena.bookstore.dtos;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import me.crvena.bookstore.models.Book;

@Data
@Builder
@AllArgsConstructor
public class BookSalesStat implements Serializable {
  private Book book;
  private Long number;
}
