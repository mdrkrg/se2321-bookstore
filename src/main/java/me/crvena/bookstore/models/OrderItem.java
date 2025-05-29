package me.crvena.bookstore.models;

import java.math.BigDecimal;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RequiredArgsConstructor
@Entity
public class OrderItem extends BaseModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  @EqualsAndHashCode.Include
  private Long id;

  @NonNull
  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @JsonBackReference // avoid loop
  @NotNull
  private Order order;

  // TODO: Do we need a createdBy field?

  @NonNull
  @ManyToOne(fetch = FetchType.EAGER)
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @NotNull
  private Book book;

  @NonNull
  @NotNull
  @Min(1)
  @ColumnDefault("1")
  @Builder.Default
  private Long number = Long.valueOf(1);

  /**
   * Snapshot of book price at buying time
   */
  @Column(precision = 19, scale = 2, nullable = false)
  @Min(0)
  private BigDecimal unitPrice;

  /**
   * The price customer paid for this item in total
   */
  @Column(precision = 19, scale = 2, nullable = false)
  @Min(0)
  private BigDecimal paidPrice;

  public static OrderItem createFromCartItem(Order order,
      CartItem cartItem, BigDecimal paidPrice) {

    return OrderItem.builder()
        .order(order)
        .book(cartItem.getBook())
        .number(cartItem.getNumber())
        .unitPrice(cartItem.getBook().getPrice())
        .paidPrice(paidPrice)
        .build();
  }
}
