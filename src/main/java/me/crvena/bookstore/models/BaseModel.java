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
  @ColumnDefault("CURRENT_TIMESTAMP")
  private Instant createdAt;

  @JsonIgnore
  @LastModifiedDate
  @UpdateTimestamp
  @ReadOnlyProperty
  @ColumnDefault("CURRENT_TIMESTAMP") // this will only take effect when manual insert
  private Instant updatedAt;
}
