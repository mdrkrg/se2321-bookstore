package me.crvena.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

// import tech.ailef.snapadmin.external.*;

@SpringBootApplication(exclude = { RedisRepositoriesAutoConfiguration.class })
@ComponentScan("me.crvena.bookstore")
@EnableCaching
@EnableJpaRepositories
// @ImportAutoConfiguration(SnapAdminAutoConfiguration.class)
public class BookstoreApplication {

  public static void main(String[] args) {
    SpringApplication.run(BookstoreApplication.class, args);
  }

}
