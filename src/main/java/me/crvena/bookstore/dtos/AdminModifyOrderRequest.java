package me.crvena.bookstore.dtos;

import java.math.BigDecimal;
import java.util.Optional;

import org.hibernate.validator.constraints.URL;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import me.crvena.bookstore.constants.ConstraintConst;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminModifyOrderRequest {

  private Optional<@Size(max = ConstraintConst.MAX_ADDRESS_LENGTH) String> receiver;

  private Optional<@Size(max = ConstraintConst.MAX_TEL_LENGTH) @Pattern(regexp = ConstraintConst.PHONE_REGEX) String> tel;

  private Optional<@Size(max = ConstraintConst.MAX_ADDRESS_LENGTH) String> address;
}
