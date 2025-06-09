package me.crvena.bookstore.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import me.crvena.bookstore.models.User;

@AllArgsConstructor
@Builder
@Data
public class AdminUserStat {
  private User user;
  private BigDecimal totalPaidPrice;
}
