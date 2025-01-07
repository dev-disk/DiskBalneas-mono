package disk.api.infrastructure.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import disk.api.domain.entities.User;
import disk.api.domain.repositories.UserRepository;

@Component
public class StartupConfig implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByLogin("admin")) {
            var user = new User();
            user.setLogin("admin");
            user.setPassword(passwordEncoder.encode("admin"));
            userRepository.save(user);
        }
    }
}
