package me.crvena.bookstore.dtos;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import lombok.Data;

@Data
public class ListResponse<T extends Serializable> {

  private List<T> items;
  private int total;

  public ListResponse(Collection<T> items) {
    this.items = items.stream().toList();
    total = this.items.size();
  }
}
