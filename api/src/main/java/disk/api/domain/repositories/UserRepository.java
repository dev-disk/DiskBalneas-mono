package disk.api.domain.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import disk.api.domain.entities.User;

public interface UserRepository extends JpaRepository<User, UUID>{
    Optional<User> findByLogin(String login);
    boolean existsByLogin(String login);
}
