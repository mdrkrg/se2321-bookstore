package me.crvena.bookstore.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.ReadOnlyProperty;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
public class UserInfo extends BaseModel {

  private String nickname;

  @URL
  private String avatar;

  private String introduction;

  @Id
  @Column(name = "user_id")
  @JsonIgnore
  private Long id;

  @EqualsAndHashCode.Include
  @NonNull
  @OneToOne
  @MapsId
  @JsonBackReference
  @OnDelete(action = OnDeleteAction.CASCADE)
  @ReadOnlyProperty
  @Setter(AccessLevel.NONE)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
}
