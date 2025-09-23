package me.crvena.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.*;
import org.springframework.context.annotation.ComponentScan;

// import tech.ailef.snapadmin.external.*;

@SpringBootApplication
@ComponentScan("me.crvena.bookstore")
// @ImportAutoConfiguration(SnapAdminAutoConfiguration.class)
public class BookstoreApplication {

  public static void main(String[] args) {
    SpringApplication.run(BookstoreApplication.class, args);
  }

}
