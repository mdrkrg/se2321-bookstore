package me.crvena.bookstore.models;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(indexes = @Index(columnList = "name"))
public class Tag extends BaseModel {

  @NonNull
  @Column(nullable = false, unique = true)
  private String name;

  @ToString.Exclude
  @ManyToMany(mappedBy = "tags")
  Set<Book> bookSet = new HashSet<>();

}
