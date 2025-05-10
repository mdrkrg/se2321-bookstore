package me.crvena.bookstore.models;

import java.io.Serializable;
import java.time.Instant;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.ReadOnlyProperty;

import jakarta.persistence.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@MappedSuperclass
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class BaseModel implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @ReadOnlyProperty
  @Setter(AccessLevel.NONE)
  @EqualsAndHashCode.Include
  private Long id;

  @Override
  public String toString() {
    return "<" + getClass().getSimpleName() + " #" + getId() + ">";
  }

  @Version
  @ReadOnlyProperty
  private Long version;

  @CreatedDate
  @CreationTimestamp
  @ReadOnlyProperty
  @Column(updatable = false)
  // @ColumnDefault("getdate()")
  private Instant createdAt;

  @LastModifiedDate
  @UpdateTimestamp
  @ReadOnlyProperty
  private Instant updatedAt;
}
