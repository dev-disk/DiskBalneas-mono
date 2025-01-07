package disk.api.dtos;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationDTO(
    @NotBlank
    String login,
    @NotBlank
    String password
) {}
