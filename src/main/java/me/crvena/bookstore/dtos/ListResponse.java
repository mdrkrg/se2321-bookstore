package me.crvena.bookstore.dtos;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;

import lombok.Data;

@Data
public class ListResponse<T> {

  private List<T> items;
  private Integer total;
  private Integer pageNumber;
  private Integer pageSize;
  private Integer totalPages;

  public ListResponse(Collection<T> items, Integer pageNumber, Integer pageSize, Integer totalPages) {
    this.items = items.stream().toList();
    total = this.items.size();
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
  }

  public ListResponse(Collection<T> items) {
    this.items = items.stream().toList();
    pageNumber = 0;
    total = this.items.size();
    pageSize = total;
    totalPages = 1;
  }

  public ListResponse(Iterable<T> items, Integer pageNumber, Integer pageSize, Integer totalPages) {
    this.items = new ArrayList<>();
    items.iterator().forEachRemaining(this.items::add);
    total = this.items.size();
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalPages = totalPages;
  }

  public static <T> ListResponse<T> of(
      Iterable<T> items, Integer pageNumber, Integer pageSize, Integer totalPages) {
    return new ListResponse<>(items, pageNumber, pageSize, totalPages);
  }

  public static <T> ListResponse<T> of(
      Collection<T> items, Integer pageNumber, Integer pageSize, Integer totalPages) {
    return new ListResponse<>(items, pageNumber, pageSize, totalPages);
  }

  public static <T> ListResponse<T> of(Page<T> items) {
    return new ListResponse<>(
        items.getContent(),
        items.getPageable().getPageNumber(),
        items.getPageable().getPageSize(),
        items.getTotalPages());
  }
}
