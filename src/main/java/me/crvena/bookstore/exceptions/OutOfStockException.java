package me.crvena.bookstore.exceptions;

import java.util.List;

import lombok.Getter;
import me.crvena.bookstore.dtos.OutOfStockErrorResponse;
import me.crvena.bookstore.dtos.OutOfStockErrorResponse.OutOfStockDetail;

@Getter
public class OutOfStockException extends RuntimeException {
  private final List<OutOfStockDetail> outOfStockItems;

  public OutOfStockException(String message, List<OutOfStockDetail> outOfStockItems) {
    super(message);
    this.outOfStockItems = outOfStockItems;
  }

  /**
   * If only one item
   */
  public OutOfStockException(String message, OutOfStockDetail outOfStockItem) {
    super(message);
    this.outOfStockItems = List.of(outOfStockItem);
  }

  public OutOfStockErrorResponse getResponse() {
    return OutOfStockErrorResponse.builder()
        .message(getMessage())
        .outOfStockItems(getOutOfStockItems())
        .build();
  }
}
