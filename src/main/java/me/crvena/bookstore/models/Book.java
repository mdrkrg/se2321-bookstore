package me.crvena.bookstore.models;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import me.crvena.bookstore.constants.ConstraintConst;

@Data
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(indexes = {
    @Index(columnList = "title"),
    @Index(columnList = "author"),
}, uniqueConstraints = @UniqueConstraint(columnNames = {
    "title",
    "author",
}))
public class Book extends BaseModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  @EqualsAndHashCode.Include
  private Long id;

  @NonNull
  @NotNull
  private String title;

  @Length(max = ConstraintConst.MAX_NAME_LENGTH)
  @NonNull
  @NotNull
  private String author;

  @Builder.Default
  @Column(columnDefinition = "TEXT")
  @ColumnDefault("''")
  private String description = "";

  @Builder.Default
  @Min(0)
  @Column(precision = 19, scale = 2, nullable = false)
  @ColumnDefault("0")
  private BigDecimal price = BigDecimal.ZERO;

  @Builder.Default
  @NotNull
  @ColumnDefault("true")
  private Boolean available = Boolean.TRUE;

  @Builder.Default
  @URL
  private String cover = null;

  @Builder.Default
  @NotNull
  @NonNull
  @ColumnDefault("0")
  private Long sales = Long.valueOf(0);

  @Builder.Default
  @NotNull
  @NonNull
  @ColumnDefault("0")
  private Long stock = Long.valueOf(0);

  @ManyToMany
  @JoinTable(joinColumns = @JoinColumn(name = "book_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
  // @JsonManagedReference // avoid loop
  @ToString.Exclude
  @Builder.Default
  private Set<Tag> tags = new HashSet<>();

  public List<Tag> getTags() {
    return tags.stream().collect(Collectors.toList());
  }

  public void addTag(Tag tag) {
    this.tags.add(tag);
    // tag.getBookSet().add(this); // bidirectional link
  }

  public void removeTag(Tag tag) {
    this.tags.remove(tag);
    // tag.getBookSet().remove(this); // bidirectional link
  }
}
