package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.crvena.bookstore.models.OrderItem;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDto {
  Long id;
  BookDto book;
  Long number;
  BigDecimal unitPrice;
  BigDecimal paidPrice;

  public static OrderItemDto of(OrderItem item) {
    return OrderItemDto.builder()
        .id(item.getId())
        .book(BookDto.of(item.getBook()))
        .number(item.getNumber())
        .unitPrice(item.getUnitPrice())
        .paidPrice(item.getPaidPrice())
        .build();
  }

  public static List<OrderItemDto> ofItems(Stream<OrderItem> items) {
    return items.map((i) -> {
      return OrderItemDto.of(i);
    }).collect(Collectors.toList());
  }
}
