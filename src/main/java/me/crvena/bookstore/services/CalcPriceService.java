package me.crvena.bookstore.services;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

@Builder
record BookPriceRequest(
    Long count, BigDecimal price) {
}

@Builder
record BookPriceResponse(
    BigDecimal result) {
}

@Service
@RequiredArgsConstructor
public class CalcPriceService {

  @Value("${service.external.calc-price.url}")
  private String url;

  @Autowired
  private final RestClient client;

  private final Logger logger = LoggerFactory.getLogger(CalcPriceService.class);

  private final ObjectMapper mapper;

  public BigDecimal calc(Long count, BigDecimal price) {

    logger.info("Sending calculation request to external micro service {}...", url);

    final var body = BookPriceRequest.builder().count(count).price(price).build();

    try {
      String jsonBody = mapper.writeValueAsString(body);
      ResponseEntity<BookPriceResponse> rsp = client
          .post()
          .uri(url)
          .contentType(MediaType.APPLICATION_JSON)
          .body(jsonBody)
          .retrieve()
          .toEntity(BookPriceResponse.class);
      return rsp.getBody().result();
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    } catch (HttpClientErrorException e) {
      throw e;
    }
  }

}
