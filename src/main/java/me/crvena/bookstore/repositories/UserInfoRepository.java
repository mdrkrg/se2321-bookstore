package me.crvena.bookstore.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import me.crvena.bookstore.models.User;
import me.crvena.bookstore.models.UserInfo;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

  UserInfo findByUser(User user);

  UserInfo findByUserId(Long userId);
}
