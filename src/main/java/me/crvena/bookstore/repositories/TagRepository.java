package me.crvena.bookstore.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.models.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

  Optional<Tag> findByName(String name);
}
