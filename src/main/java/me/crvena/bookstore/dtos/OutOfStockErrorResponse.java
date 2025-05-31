package me.crvena.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Builder
@Getter
@AllArgsConstructor
public class OutOfStockErrorResponse {
  @Builder
  @Getter
  @AllArgsConstructor
  public static class OutOfStockDetail {
    private Long cartItemId;
    private String title;
    private Long requested;
    private Long available;
  }

  private String message;
  private List<OutOfStockDetail> outOfStockItems;
}
