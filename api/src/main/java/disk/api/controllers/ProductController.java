package disk.api.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import disk.api.dtos.productDto.ProductRequest;
import disk.api.services.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping(value = "/products")
@Tag(name = "Products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Registra um produto.", method = "POST")
    @PostMapping()
    public ResponseEntity createProduct(@RequestBody ProductRequest productRegister) {
        
        var response = this.productService.newProduct(productRegister);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @Operation(summary = "Retorna os produtos.", method = "GET")
    @GetMapping()
    public ResponseEntity getProducts () {

        var response = this.productService.getProduct();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @Operation(summary = "Atualiza um produto.", method = "PUT")
    @PutMapping("/{id}")
    public ResponseEntity putProduct (@PathVariable Long id, @RequestBody @Valid ProductRequest updateProduct) {
        var response = this.productService.updateProduct(id, updateProduct);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @Operation(summary = "Deleta um produto.", method = "DELETE")
    @DeleteMapping("/{id}")
    public ResponseEntity deleteProduct (@PathVariable Long id) {
        var response = this.productService.deleteProduct(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
    
}
