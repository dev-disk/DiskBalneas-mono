package disk.api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import disk.api.domain.entities.User;
import disk.api.domain.repositories.UserRepository;
import disk.api.dtos.authDto.LoginRequest;
import disk.api.dtos.responsesDto.ServiceResponse;
import disk.api.infrastructure.security.TokenService;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;
    public ServiceResponse<String> login (LoginRequest request) {
    
        ServiceResponse<String> response = new ServiceResponse<String>();

        User user = this.userRepository.findByLogin(request.login()).orElse(null);

        if (user == null) {
            response.setStatus(HttpStatus.NOT_FOUND);
            response.setMessage("Usuário não encontrado.");
            return response;
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            response.setMessage("Senha incorreta!");
            response.setStatus(HttpStatus.UNAUTHORIZED);
            return response;
        }

        String token = this.tokenService.generateToken(user);
        response.setData(token);
        response.setMessage("Login autorizado.");
        response.setStatus(HttpStatus.OK);
        return response;
    }
}

