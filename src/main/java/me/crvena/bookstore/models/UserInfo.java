package me.crvena.bookstore.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.validator.constraints.URL;
import org.springframework.data.annotation.ReadOnlyProperty;

import jakarta.persistence.*;
import lombok.*;

@Data
@EqualsAndHashCode(callSuper = true)
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

  @NonNull
  @OneToOne
  @OnDelete(action = OnDeleteAction.CASCADE)
  @ReadOnlyProperty
  @Setter(AccessLevel.NONE)
  @JoinColumn(nullable = false)
  private User user;
}
