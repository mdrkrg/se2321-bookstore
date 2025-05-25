package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.validator.constraints.URL;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import me.crvena.bookstore.constants.ConstraintConst;

@Data
public class CreateBookRequest {
  @NotNull
  @Size(max = ConstraintConst.MAX_NAME_LENGTH)
  private String author;

  @NotNull
  private String title;

  private Boolean available = true;

  private String description = "";

  @Min(0)
  private BigDecimal price = BigDecimal.ZERO;

  @URL
  private String cover = null;

  @Min(0)
  private Long stock = Long.valueOf(0);

  private List<Long> tagIds = new ArrayList<>();
}
