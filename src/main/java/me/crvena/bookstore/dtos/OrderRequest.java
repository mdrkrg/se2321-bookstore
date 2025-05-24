package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class Item {
    @NotBlank
    private Long itemId;
    @NotBlank
    private BigDecimal paidPrice;
  }

  @NotBlank
  private Set<Item> items;
  @NotBlank
  private String tel;
  @NotBlank
  private String receiver;
  @NotBlank
  private String address;
}
