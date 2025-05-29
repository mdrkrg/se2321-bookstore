package me.crvena.bookstore.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
    @NotNull
    private Long bookId;
    @Min(1)
    @NotNull
    private Long number;
  }

  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class PatchCartItemRequest {
    @Min(1)
    @NotNull
    private Long number;
  }
}
