package disk.api.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import disk.api.domain.entities.Product;
import disk.api.domain.entities.User;
import disk.api.domain.repositories.ProductRepository;
import disk.api.dtos.productDto.ProductRequest;
import disk.api.dtos.productDto.ProductResponse;
import disk.api.dtos.responsesDto.ServiceResponse;
import disk.api.infrastructure.security.TokenService;
import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepo;
    private final TokenService tokenService;

    public ServiceResponse<String> newProduct(ProductRequest ProductRegister){
        var response = new ServiceResponse<String>();
        User currentUser = tokenService.getCurrentUser();
        if (currentUser == null) {
            response.setMessage("Usuário não autenticado");
            response.setStatus(HttpStatus.UNAUTHORIZED);
            return response;
        }

        Product product = new Product();
        product.setCategory(ProductRegister.category());
        product.setProductName(ProductRegister.productName());
        product.setSalePrice(ProductRegister.salePrice());
        product.setCostPrice(ProductRegister.costPrice());
        product.setStockQuantity(ProductRegister.stockQuantity());
        product.setUnitMeasure(ProductRegister.unitMeasure());

        this.productRepo.save(product);

        response.setMessage("Produto criado com sucesso.");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    public ServiceResponse<List<ProductResponse>> getProduct(){
        var response = new ServiceResponse<List<ProductResponse>>();

        User currentUser = tokenService.getCurrentUser();

        if (currentUser == null) {
            response.setMessage("Usuário não autenticado");
            response.setStatus(HttpStatus.UNAUTHORIZED);
            return response;
        }
        List<Product> products = productRepo.findByDeletedAtIsNull();

        List<ProductResponse> productResponses = products.stream()
            .map(p -> new ProductResponse(
                p.getId(),
                p.getProductName(),
                p.getSalePrice(),
                p.getStockQuantity(),
                p.getUnitMeasure()
            ))
        .collect(Collectors.toList());

        response.setData(productResponses);
        response.setStatus(HttpStatus.ACCEPTED);
        return response;
    }
    public ServiceResponse<String> updateProduct (String id, ProductRequest updateProduct) {
        var response = new ServiceResponse<String>();
        User currentUser = tokenService.getCurrentUser();
        if (currentUser == null) {
            response.setMessage("Usuário não autenticado");
            response.setStatus(HttpStatus.UNAUTHORIZED);
            return response;
        }

        UUID productId;
        try {
            productId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            response.setMessage("Produto inválido.");
            response.setStatus(HttpStatus.BAD_REQUEST);
            return response;
        }

        var productEntity = this.productRepo.findById(productId);

        if (productEntity.isPresent()) {
            var product = productEntity.get();

            int newStockQuantity = product.getStockQuantity() + updateProduct.stockQuantity();

            product.setProductName(updateProduct.productName());
            product.setCategory(updateProduct.category());
            product.setSalePrice(updateProduct.salePrice());
            product.setCostPrice(updateProduct.costPrice());
            product.setStockQuantity(newStockQuantity);

            productRepo.save(product);
            response.setMessage("Atualizado com sucesso!");
            response.setStatus(HttpStatus.ACCEPTED);

        } else {
            response.setMessage("Produto não encontrado.");
            response.setStatus(HttpStatus.BAD_REQUEST);
        }
        return response;
    }
    public ServiceResponse<String> deleteProduct (String id) {
        var response = new ServiceResponse<String>();
        User currentUser = tokenService.getCurrentUser();
        if (currentUser == null) {
            response.setMessage("Usuário não autenticado");
            response.setStatus(HttpStatus.UNAUTHORIZED);
            return response;
        }

        UUID productId;
        try {
            productId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            response.setMessage("Produto Inválido.");
            response.setStatus(HttpStatus.BAD_REQUEST);
            return response;
        }

        var productOpt = productRepo.findById(productId);

        if ( productOpt.isPresent()) {
            Product product = productOpt.get();

            if (product.getDeletedAt() != null) {
                response.setMessage("O produto já foi deletado!");
                response.setStatus(HttpStatus.BAD_REQUEST);
                return response;
            }

            product.setDeletedAt(LocalDateTime.now());
            productRepo.save(product);

            response.setMessage("Produto deletado com sucesso!");
            response.setStatus(HttpStatus.ACCEPTED);
        } else {
            response.setMessage("Produto não encontrado.");
            response.setStatus(HttpStatus.NOT_FOUND);
        }
        return response;
    }

}
