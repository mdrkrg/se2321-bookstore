package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.Set;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotNull
    private Long itemId;
    @Min(0)
    @NotNull
    private BigDecimal paidPrice;
  }

  @NotNull
  private Set<Item> items;
  @NotBlank
  private String tel;
  @NotBlank
  private String receiver;
  @NotBlank
  private String address;
}
