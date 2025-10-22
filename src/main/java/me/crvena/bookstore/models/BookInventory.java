package me.crvena.bookstore.models;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class BookInventory {

  @Id
  @Column(name = "book_id")
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @MapsId
  @JoinColumn(name = "book_id")
  private Book book;

  @Builder.Default
  @NonNull
  @Column(nullable = false)
  @ColumnDefault("0")
  private Long sales = 0L;

  @Builder.Default
  @NonNull
  @Column(nullable = false)
  @ColumnDefault("0")
  private Long stock = 0L;

  /**
   * Caller should check book's stock before calling
   */
  public BookInventory beOrdered(Long quantity) throws RuntimeException {
    stock -= quantity;
    sales += quantity;
    return this;
  }
}
