package me.crvena.bookstore.models;

import me.crvena.bookstore.constants.ConstraintConst;
import me.crvena.bookstore.dtos.OrderRequest;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.validator.constraints.*;
import org.springframework.data.annotation.CreatedBy;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order extends BaseModel {

  @NonNull
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @JsonManagedReference // avoid loop
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "order", orphanRemoval = true, fetch = FetchType.EAGER)
  private Set<OrderItem> items;

  @NonNull
  @ToString.Exclude
  @ManyToOne
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @CreatedBy
  @JoinColumn(name = "creator_id", nullable = false)
  private User creator;

  @Length(max = ConstraintConst.MAX_NAME_LENGTH)
  String receiver;

  // TODO: regex validation (in DTO?)
  @Length(max = ConstraintConst.MAX_TEL_LENGTH)
  @Pattern(regexp = ConstraintConst.PHONE_REGEX)
  String tel;

  @Length(max = ConstraintConst.MAX_ADDRESS_LENGTH)
  String address;

  /**
   * Create an Order from an {@link OrderRequest}.
   * Will initilaize a set of {@link OrderItem} from {@link CartItem}s in
   * orderRequest.
   *
   * @param creator      The creator of the order.
   * @param orderRequest {@link OrderRequest} body.
   */
  public static Order createFromOrderRequest(User creator, OrderRequest orderRequest) {
    Set<OrderItem> orderItems = new HashSet<>();
    Order order = new Order(
        orderItems, creator, orderRequest.getRecevier(), orderRequest.getTel(), orderRequest.getAddress());

    for (CartItem item : orderRequest.getItems()) {
      OrderItem orderItem = OrderItem.createFromCartItem(order, item, orderRequest.getPaidPrice());
      orderItems.add(orderItem);
    }

    // order.setItems(orderItems);
    return order;
  }

  public BigDecimal getTotalPaidPrice() {
    return items.stream()
        .map(OrderItem::getPaidPrice)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }

  public BigDecimal getOriginalPrice() {
    return items.stream()
        .map(item -> item.getUnitPrice().multiply(
            BigDecimal.valueOf(item.getNumber())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);
  }
}
