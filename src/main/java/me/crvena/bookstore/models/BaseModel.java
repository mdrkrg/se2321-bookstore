package me.crvena.bookstore.models;

import java.io.Serializable;
import java.time.Instant;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.ReadOnlyProperty;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

  @JsonIgnore
  @Version
  @ReadOnlyProperty
  @ColumnDefault("0")
  private Long version;

  @JsonIgnore
  @CreatedDate
  @CreationTimestamp
  @ReadOnlyProperty
  @Column(updatable = false)
  @ColumnDefault("NOW()")
  private Instant createdAt;

  @JsonIgnore
  @LastModifiedDate
  @UpdateTimestamp
  @ReadOnlyProperty
  @ColumnDefault("NOW()") // this will only take effect when manual insert
  private Instant updatedAt;
}
