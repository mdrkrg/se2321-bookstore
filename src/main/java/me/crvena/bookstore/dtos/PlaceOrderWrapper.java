package me.crvena.bookstore.dtos;

import lombok.Builder;

@Builder
public record PlaceOrderWrapper(
    OrderRequest orderRequest, Long userId) {
}
