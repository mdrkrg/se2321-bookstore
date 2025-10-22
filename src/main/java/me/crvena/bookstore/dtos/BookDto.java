package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.OrderItem;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDto {
  Long id;
  String title;
  String author;
  String description;
  BigDecimal price;
  Boolean available;
  String cover;
  Long sales;
  Long stock;
  List<TagDto> tags;

  public static BookDto of(Book book) {
    final var inventory = book.getInventory();
    return BookDto.builder()
        .id(book.getId())
        .title(book.getTitle())
        .author(book.getAuthor())
        .description(book.getDescription())
        .price(book.getPrice())
        .available(book.getAvailable())
        .cover(book.getCover())
        .sales(inventory.getSales())
        .stock(inventory.getStock())
        .tags(TagDto.ofTags(book.getTags().stream()))
        .build();
  }

  public static List<OrderItemDto> ofItems(Stream<OrderItem> items) {
    return items.map((i) -> {
      return OrderItemDto.of(i);
    }).collect(Collectors.toList());
  }
}
