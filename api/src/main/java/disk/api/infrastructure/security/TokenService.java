package disk.api.infrastructure.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import disk.api.domain.entities.User;
import disk.api.domain.repositories.UserRepository;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;
    private final UserRepository userRepo;
    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

    public TokenService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public String generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                .withIssuer("Disk Balneas Api")
                .withSubject(user.getLogin())
                .withExpiresAt(genExpirationDate())
                .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token", exception);
        }
    }

    public String validateToken(String token) {
        
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("Disk Balneas Api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
    String login;
    if (authentication.getPrincipal() instanceof User) {
        login = ((User) authentication.getPrincipal()).getLogin();
    } else {
        login = authentication.getName();
    }
    logger.info("Login: {}", login);
    
    return userRepo.findByLogin(login)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "Token inválido ou usuário não encontrado"
        ));
    }

    private Instant genExpirationDate() {
        return LocalDateTime.now().plusMinutes(10).toInstant(ZoneOffset.of("-03:00"));
    }
}
