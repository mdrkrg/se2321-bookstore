package me.crvena.bookstore.models;

import java.math.BigDecimal;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedBy;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * CartItem is seem to be a little bit verbose, since it will be created over
 * and over again.
 */
@Data
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint(name = "unique_cart_item_book_creator", columnNames = { "book_id", "creator_id" })
})
public class CartItem extends BaseModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  @EqualsAndHashCode.Include
  private Long id;

  /**
   * The owner of the CartItem
   */
  @NonNull
  @ManyToOne
  @OnDelete(action = OnDeleteAction.CASCADE)
  @CreatedBy
  @JsonIgnore
  @JoinColumn(name = "creator_id", nullable = false)
  private User creator;

  // deleting a Book will delete CartItem
  // but not in reverse
  @NonNull
  @ManyToOne(fetch = FetchType.EAGER)
  @OnDelete(action = OnDeleteAction.CASCADE)
  @NotNull
  private Book book;

  @Min(1)
  @NonNull
  @NotNull
  @ColumnDefault("1")
  private Long number = Long.valueOf(1);

  public BigDecimal getPrice() {
    return book.getPrice().multiply(BigDecimal.valueOf(number));
  }
}
