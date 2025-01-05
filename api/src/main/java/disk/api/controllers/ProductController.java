package disk.api.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import disk.api.dtos.ProductRequest;
import disk.api.dtos.ProductResponse;
import disk.api.services.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value = "/products")
@Tag(name = "Products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Registrar um produto.", method = "POST")
    @PostMapping()
    public String createProduct(@RequestBody ProductRequest productRegister) {
        
        this.productService.newProduct(productRegister);
        
        return "Produto registrado com sucesso";
    }

    @Operation(summary = "Retorna os produtos.", method = "GET")
    @GetMapping()
    public List<ProductResponse> getProducts () {

        return productService.getProduct();
    }
    
}
