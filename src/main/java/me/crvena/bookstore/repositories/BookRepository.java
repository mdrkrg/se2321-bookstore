package me.crvena.bookstore.repositories;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.models.Book;
import me.crvena.bookstore.models.Tag;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

  Optional<Book> findByTitle(String title);

  List<Book> findByTagsIn(@Param("tags") Set<Tag> tags);
}
