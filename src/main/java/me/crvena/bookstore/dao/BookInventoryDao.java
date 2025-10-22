package me.crvena.bookstore.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import me.crvena.bookstore.models.BookInventory;
import me.crvena.bookstore.repositories.BookInventoryRepository;

public interface BookInventoryDao {

  public BookInventory save(BookInventory inventory);

  public Iterable<BookInventory> saveAll(Iterable<BookInventory> inventories);

}

@Repository
@RequiredArgsConstructor
class BookInventoryDaoImpl implements BookInventoryDao {

  @Autowired
  private final BookInventoryRepository repo;

  @Override
  public BookInventory save(BookInventory inventory) {
    return repo.save(inventory);
  }

  @Override
  public Iterable<BookInventory> saveAll(Iterable<BookInventory> inventories) {
    return repo.saveAll(inventories);
  }
}
