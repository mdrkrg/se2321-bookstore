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
  private Set<Long> itemIds;
  private BigDecimal paidPrice;
  private String tel;
  private String recevier;
  private String address;
}
