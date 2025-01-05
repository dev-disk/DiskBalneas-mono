package disk.api.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import disk.api.domain.entities.Sale;
import disk.api.dtos.SaleRequest;
import disk.api.dtos.SaleResponse;
import disk.api.services.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping(value = "/sales")
@Tag(name = "Sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @Operation(summary = "Cria uma nova venda.", method = "POST")
    @PostMapping()
    public Sale newSale(@RequestBody SaleRequest saleRegister) {
        
        return this.saleService.createSale(saleRegister);
    }
    

    @Operation(summary = "Histórico de vendas.", method = "GET")
    @GetMapping()
    public List<SaleResponse> getSalesHistory() {

        return saleService.History();

    }
    
}
