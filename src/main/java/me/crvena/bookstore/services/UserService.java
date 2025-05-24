package me.crvena.bookstore.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import me.crvena.bookstore.models.User;
import me.crvena.bookstore.repositories.UserRepository;

@Deprecated(forRemoval = true)
@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Transactional
  public User getOrCreateTestUser() {
    final String testUserName = "TEST_USER";
    final String testPassword = "password";
    final String testEmail = "test@example.com";
    return userRepository.findByUsername(testUserName)
        .orElseGet(() -> {
          User newUser = new User(testUserName, testEmail, testPassword);
          return userRepository.save(newUser);
        });
  }
}
