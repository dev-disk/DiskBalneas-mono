package disk.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import disk.api.dtos.authDto.LoginRequest;
import disk.api.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping (value = "/auth")
@Tag (name = "Auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Autentica o usuário.", method = "POST")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest loginRequest) {
        
        var response = this.authService.login(loginRequest);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/ping")
    public String ping() {

        return "Ok!";
    }
    
}
