package me.crvena.bookstore.dtos;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.crvena.bookstore.models.Tag;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TagDto {
  Long id;
  String name;

  public static TagDto of(Tag tag) {
    return TagDto.builder()
        .id(tag.getId())
        .name(tag.getName())
        .build();
  }

  public static List<TagDto> ofTags(Stream<Tag> items) {
    return items.map((i) -> {
      return TagDto.of(i);
    }).collect(Collectors.toList());
  }
}
