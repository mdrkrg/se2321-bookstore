package me.crvena.bookstore.models;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedBy;

import lombok.*;

/**
 * The cart should be create when (after) the user has created
 *
 * @see me.crvena.bookstore.services.UserService
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
public class Cart extends BaseModel {

  public static final int MAX_ADDRESS_LENGTH = 100;
  public static final int MAX_NAME_LENGTH = 50;
  public static final int MAX_TEL_LENGTH = 30;

  // ensure not remove cart
  @ToString.Exclude
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "cart", orphanRemoval = true)
  private Set<CartItem> items = new HashSet<>();

  /**
   * One user can only have one cart.
   * They will CURD on the items contained in the cart.
   * Cascade ALL is intentional.
   */
  @NonNull
  @ToString.Exclude
  @OneToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
  @OnDelete(action = OnDeleteAction.CASCADE)
  @CreatedBy
  @JoinColumn(nullable = false)
  private User user;

  public BigDecimal getTotalPrice() {
    return items.stream()
        .map(item -> item.getPrice())
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }
}
