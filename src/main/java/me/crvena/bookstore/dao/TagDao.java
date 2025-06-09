package me.crvena.bookstore.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import me.crvena.bookstore.models.Tag;
import me.crvena.bookstore.repositories.TagRepository;

public interface TagDao {

  public Optional<Tag> findByName(String name);

  public Optional<Tag> findById(Long id);

}

@Repository
@RequiredArgsConstructor
class TagDaoImpl implements TagDao {

  @Delegate
  @Autowired
  private final TagRepository repo;

}
