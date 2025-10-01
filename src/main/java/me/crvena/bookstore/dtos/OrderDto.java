package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.crvena.bookstore.models.Order;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {
  Long id;
  String receiver;
  String tel;
  String address;
  Instant createdAt;
  List<OrderItemDto> items;
  BigDecimal totalPaidPrice;
  BigDecimal originalPrice;

  public static OrderDto of(Order order) {
    return OrderDto.builder()
        .id(order.getId())
        .receiver(order.getReceiver())
        .tel(order.getTel())
        .address(order.getAddress())
        .createdAt(order.getCreatedAt())
        .items(OrderItemDto.ofItems(order.getItems().stream()))
        .totalPaidPrice(order.getTotalPaidPrice())
        .originalPrice(order.getOriginalPrice())
        .build();
  }
}
