package com.stanco.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "c3RhbmNvLXNlY3JldC1rZXktZm9yLWp3dC1hdXRoZW50aWNjYXRpb24=";


    private final SecretKey key;


    public JwtService() {

        this.key =
                Keys.hmacShaKeyFor(
                        Decoders.BASE64.decode(
                                SECRET_KEY
                        )
                );
    }


    public String generateToken(
            String empID,
            String name,
            String roleType) {

        return Jwts.builder()

                .subject(empID)

                .claim(
                        "name",
                        name
                )

                .claim(
                        "role",
                        roleType
                )

                .issuedAt(
                        new Date()
                )

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000L * 60 * 60
                        )
                )

                .signWith(key)

                .compact();
    }



    public String extractEmpID(
            String token) {

        return extractAllClaims(token)
                .getSubject();
    }


    public String extractRole(
            String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }


    public String extractName(
            String token) {

        return extractAllClaims(token)
                .get("name", String.class);
    }



    public boolean isTokenValid(
            String token) {

        try {

            Claims claims =
                    extractAllClaims(token);


            return claims.getExpiration()
                    .after(new Date());

        } catch (Exception e) {

            return false;
        }
    }


    private Claims extractAllClaims(
            String token) {

        return Jwts.parser()

                .verifyWith(key)

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}