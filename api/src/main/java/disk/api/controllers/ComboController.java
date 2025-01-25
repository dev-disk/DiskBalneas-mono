package disk.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import disk.api.dtos.comboDto.ComboRequest;
import disk.api.services.ComboService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping(value = "/combos")
@Tag(name = "Combos")
@RequiredArgsConstructor
public class ComboController {

    private final ComboService comboService;

    @Operation(summary = "Registra um Combo.", method = "POST")
    @PostMapping()
    public ResponseEntity createCombo(@RequestBody ComboRequest comboRequest) {

        var response = this.comboService.createCombo(comboRequest);
        return ResponseEntity.status(response.getStatus()).body(response);

    }

    @Operation(summary = "Retorna os combos criados.", method = "GET")
    @GetMapping()
    public ResponseEntity getCombos() {

        var response = this.comboService.getCombos();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
}