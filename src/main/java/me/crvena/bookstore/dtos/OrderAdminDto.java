package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import me.crvena.bookstore.models.Order;
import me.crvena.bookstore.models.OrderItem;
import me.crvena.bookstore.models.User;

@Builder
@Data
@AllArgsConstructor
public class OrderAdminDto {
  Long id;
  String receiver;
  String tel;
  String address;
  Instant createdAt;
  BigDecimal totalPaidPrice;
  BigDecimal originalPrice;
  User creator;
  Set<OrderItem> items;

  public static OrderAdminDto of(Order order) {
    return OrderAdminDto.builder()
        .id(order.getId())
        .receiver(order.getReceiver())
        .tel(order.getTel())
        .address(order.getAddress())
        .createdAt(order.getCreatedAt())
        .items(order.getItems())
        .totalPaidPrice(order.getTotalPaidPrice())
        .originalPrice(order.getOriginalPrice())
        .creator(order.getCreator())
        .build();
  }
}
