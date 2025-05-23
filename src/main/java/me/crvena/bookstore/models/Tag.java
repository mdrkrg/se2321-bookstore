package me.crvena.bookstore.models;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(indexes = @Index(columnList = "name"))
public class Tag extends BaseModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  @EqualsAndHashCode.Include
  private Long id;

  @NonNull
  @Column(nullable = false, unique = true)
  private String name;

  @ToString.Exclude
  @JsonBackReference
  @ManyToMany(mappedBy = "tags")
  private Set<Book> bookSet;

}
