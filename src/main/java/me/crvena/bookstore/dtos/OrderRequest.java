package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.Set;

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
    private Long itemId;
    private BigDecimal paidPrice;
  }

  private Set<Item> items;
  private String tel;
  private String receiver;
  private String address;
}
