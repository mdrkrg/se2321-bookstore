package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.hibernate.validator.constraints.URL;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;
import me.crvena.bookstore.constants.ConstraintConst;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ModifyBookRequest {

  private Optional<@Size(max = ConstraintConst.MAX_NAME_LENGTH) String> author;

  private Optional<String> title;

  private Optional<Boolean> available;

  private Optional<@Min(0) BigDecimal> price;

  // private Optional<@URL String> cover;

  private Optional<@Min(0) Long> sales;

  private Optional<@Min(0) Long> stock;

  private Optional<List<Long>> tagIds;
}
