package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.Order;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserOrderStatResponse {

  private BigDecimal totalPrice;
  private Long totalNumber;
  private List<BookSalesStat> bookStats;

  public UserOrderStatResponse(Collection<Order> orders) {
    var totalPrice = BigDecimal.ZERO;
    Long totalNumber = Long.valueOf(0);
    Map<Book, Long> bookNumberMap = new HashMap<>();
    for (var order : orders) {
      totalPrice = totalPrice.add(order.getTotalPaidPrice());

      final var items = order.getItems();
      for (var item : items) {
        final var book = item.getBook();
        final var oldNumber = bookNumberMap.get(item.getBook());
        final var newNumber = oldNumber == null ? item.getNumber() : oldNumber + item.getNumber();
        bookNumberMap.put(book, newNumber);

        totalNumber += item.getNumber();
      }
    }

    this.totalPrice = totalPrice;
    this.totalNumber = totalNumber;
    this.bookStats = bookNumberMap.entrySet().stream().map(entry -> {
      return new BookSalesStat(entry.getKey(), entry.getValue());
    }).toList();
  }
}
