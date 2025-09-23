package me.crvena.bookstore.services;

import java.time.Duration;
import java.time.Instant;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;

@Service
public interface SessionTimerService {
  public void startTimer();

  public Duration getInterval();

  public Instant startTime();
}

@Service
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.INTERFACES)
class SessionTimerServiceImpl implements SessionTimerService {

  private Instant startTime;

  public Instant startTime() {
    return startTime;
  }

  public void startTimer() {
    startTime = Instant.now();
  }

  public Duration getInterval() {

    System.out.println(startTime());
    return Duration.between(startTime, Instant.now());
  }
}
