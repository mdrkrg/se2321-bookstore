package me.crvena.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class CartItemRequest {
  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class PostCartItemRequest {
    private Long bookId;
    private Long number;
  }

  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class PatchCartItemRequest {
    private Long number;
  }
}
