package me.crvena.bookstore.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.models.BookInventory;

@Repository
public interface BookInventoryRepository extends CrudRepository<BookInventory, Long> {

}
