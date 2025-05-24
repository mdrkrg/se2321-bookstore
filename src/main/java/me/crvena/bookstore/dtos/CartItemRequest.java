package me.crvena.bookstore.dtos;

import jakarta.validation.constraints.NotBlank;
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
    @NotBlank
    private Long bookId;
    @NotBlank
    private Long number;
  }

  @Data
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class PatchCartItemRequest {
    @NotBlank
    private Long number;
  }
}
