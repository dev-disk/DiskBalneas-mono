package disk.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import disk.api.domain.entities.User;
import disk.api.domain.repositories.UserRepository;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User validateUser(String login, String password) {
        User user = userRepository.findByLogin(login)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }
        
        return user;
    }
}

