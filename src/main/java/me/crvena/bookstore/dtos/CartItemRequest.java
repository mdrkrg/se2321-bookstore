package me.crvena.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.crvena.bookstore.models.Book;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequest {
  private Book book;
  private Long number;
}
