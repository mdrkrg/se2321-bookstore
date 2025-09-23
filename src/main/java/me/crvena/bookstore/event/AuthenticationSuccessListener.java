package me.crvena.bookstore.event;

import me.crvena.bookstore.services.SessionTimerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationSuccessListener implements ApplicationListener<AuthenticationSuccessEvent> {

  @Autowired
  private SessionTimerService sessionTimerService;

  /**
   * Spring security creates a new session for the authenticated user.
   * Therefore we need to hook into the post authentication and start the timer
   * here.
   */
  @Override
  public void onApplicationEvent(AuthenticationSuccessEvent event) {
    sessionTimerService.startTimer();
  }
}
