package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.crvena.bookstore.models.CartItem;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
  private Long id;
  private Set<CartItem> items;
  private BigDecimal paidPrice;
  private String tel;
  private String recevier;
  private String address;
}
