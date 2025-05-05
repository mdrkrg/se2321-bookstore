package me.crvena.bookstore.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import me.crvena.bookstore.models.User;
import me.crvena.bookstore.models.UserInfo;

@RepositoryRestResource(collectionResourceRel = "userinfo", path = "userinfo", exported = false)
public interface UserInfoRepository extends CrudRepository<UserInfo, Long> {

  UserInfo findByUser(User user);

  UserInfo findByUserId(Long userId);
}
