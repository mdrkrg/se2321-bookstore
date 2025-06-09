package me.crvena.bookstore.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import lombok.experimental.Delegate;
import me.crvena.bookstore.models.User;
import me.crvena.bookstore.repositories.UserRepository;

public interface UserDao {

  List<User> findAll();

  Optional<User> findById(Long id);

  Optional<User> findByUsername(String username);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  User save(User user);
}

@Repository
@RequiredArgsConstructor
class UserDaoImpl implements UserDao {

  @Delegate
  @Autowired
  private final UserRepository repo;

  @Override
  public User save(User user) {
    return repo.save(user);
  }

}
