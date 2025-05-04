package me.crvena.bookstore.models;

import java.math.BigDecimal;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * CartItem is seem to be a little bit verbose, since it will be created over
 * and over again.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
public class CartItem extends BaseModel {

  // deleting a Cart will delete CartItem
  // but not in reverse
  @NonNull
  @ToString.Exclude
  @ManyToOne(fetch = FetchType.LAZY)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @NotNull
  private Cart cart;

  // deleting a Book will delete CartItem
  // but not in reverse
  @NonNull
  @ToString.Exclude
  @ManyToOne(fetch = FetchType.EAGER)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @NotNull
  private Book book;

  @Min(1)
  @NonNull
  @NotNull
  @ColumnDefault("1")
  private Integer number = 1;

  public BigDecimal getPrice() {
    return book.getPrice().multiply(BigDecimal.valueOf(number));
  }
}
