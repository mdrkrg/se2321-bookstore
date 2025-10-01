package me.crvena.bookstore.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceOrderWrapper {
  public OrderRequest orderRequest;
  public Long userId;
}
