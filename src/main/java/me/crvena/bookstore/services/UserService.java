package me.crvena.bookstore.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import me.crvena.bookstore.dtos.AdminModifyUserRequest;
import me.crvena.bookstore.models.User;
import me.crvena.bookstore.repositories.UserRepository;

@Service
public interface UserService {
  public User modifyUser(User user, AdminModifyUserRequest data)
      throws RuntimeException;
}

@Service
class UserServiceImpl implements UserService {

  @Autowired
  private UserRepository repository;

  @Autowired
  private ObjectMapper mapper;

  @Transactional
  public User modifyUser(User user, AdminModifyUserRequest data)
      throws RuntimeException {
    try {
      var UserInfoData = data.getUserInfo();
      // avoid directly updating
      data.setUserInfo(null);
      mapper.updateValue(user, data);
      mapper.updateValue(user.getUserInfo(), UserInfoData);
      return repository.save(user);
    } catch (JsonMappingException e) {
      throw new RuntimeException(e.getMessage());
    }
  }
}
