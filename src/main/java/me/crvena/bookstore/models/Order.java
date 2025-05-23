package me.crvena.bookstore.models;

import me.crvena.bookstore.constants.ConstraintConst;

import java.math.BigDecimal;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.validator.constraints.*;
import org.springframework.data.annotation.CreatedBy;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order extends BaseModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  @EqualsAndHashCode.Include
  private Long id;

  @NonNull
  @ToString.Exclude
  @JsonManagedReference // avoid loop
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "order", orphanRemoval = true, fetch = FetchType.EAGER)
  private Set<OrderItem> items;

  @NonNull
  @ToString.Exclude
  @ManyToOne
  @OnDelete(action = OnDeleteAction.RESTRICT)
  @CreatedBy
  @JsonIgnore
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
