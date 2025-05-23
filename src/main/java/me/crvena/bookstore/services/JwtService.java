package me.crvena.bookstore.services;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Service
public interface JwtService {

  public String extractUsername(String jwt);

  public <T> T extractClaim(String jwt, Function<Claims, T> claimsResolver);

  public String generateToken(UserDetails userDetails);

  public String generateToken(Map<String, Object> claims, UserDetails userDetails);

  public boolean isTokenValid(String jwt, UserDetails userDetails);

  public boolean isTokenExpired(String jwt);

  public Date extractExpiration(String jwt);

  public Claims extractAllClaims(String jwt);

  public Key getSigningKey();

  public long getExpirationMs();

}

@Service
@RequiredArgsConstructor
class JwtServiceImpl implements JwtService {

  @Value("${jwt.secret}")
  public String secret;

  @Getter
  @Value("${jwt.expiration}")
  public long expirationMs;

  public String extractUsername(String jwt) {
    return extractClaim(jwt, Claims::getSubject);
  }

  public <T> T extractClaim(String jwt, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(jwt);
    return claimsResolver.apply(claims);
  }

  public String generateToken(UserDetails userDetails) {
    return generateToken(Map.of(), userDetails);
  }

  public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean isTokenValid(String jwt, UserDetails userDetails) {
    final String username = extractUsername(jwt);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwt));
  }

  public boolean isTokenExpired(String jwt) {
    return extractExpiration(jwt).before(new Date());
  }

  public Date extractExpiration(String jwt) {
    return extractClaim(jwt, Claims::getExpiration);
  }

  public Claims extractAllClaims(String jwt) {
    return Jwts
        .parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(jwt)
        .getBody();
  }

  public Key getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
  }

}
