package me.crvena.bookstore.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
import me.crvena.bookstore.dao.UserDao;
import me.crvena.bookstore.dtos.AdminModifyUserRequest;
import me.crvena.bookstore.models.User;

@Service
public interface UserService {
  public User modifyUser(User user, AdminModifyUserRequest data)
      throws RuntimeException;
}

@Service
class UserServiceImpl implements UserService {

  @Autowired
  private UserDao dao;

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
      dao.save(user);
      User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      // update auth
      if (currentUser.equals(user)) {
        UsernamePasswordAuthenticationToken newAuth = new UsernamePasswordAuthenticationToken(
            user,
            SecurityContextHolder.getContext().getAuthentication().getCredentials(),
            user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(newAuth);
      }
      return user;
    } catch (JsonMappingException e) {
      throw new RuntimeException(e.getMessage());
    }
  }
}
