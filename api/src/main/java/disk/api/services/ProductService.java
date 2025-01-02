package disk.api.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import disk.api.domain.entities.Product;
import disk.api.domain.repositories.ProductRepository;
import disk.api.dtos.ProductRequest;
import disk.api.dtos.ProductResponse;
import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepo;

    public Product newProduct(ProductRequest ProductRegister){
        

        Product product = new Product();
        product.setProductName(ProductRegister.productName());
        product.setSalePrice(ProductRegister.salePrice());
        product.setCostPrice(ProductRegister.costPrice());
        product.setStockQuantity(ProductRegister.stockQuantity());
        product.setUnit(ProductRegister.unit());

        this.productRepo.save(product);
        return product;
    }

    public List<ProductResponse> getProduct(){
        List<Product> product = productRepo.findAll();

        return product.stream()
        .map(p -> new ProductResponse(
            p.getId(),
            p.getProductName(),
            p.getSalePrice(),
            p.getStockQuantity(),
            p.getUnit()
        ))
        .collect(Collectors.toList());
    }

    public Product updateProduct(UUID id, ProductRequest updateProduct) {
        
        Product product = this.productRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        product.setProductName(updateProduct.productName());
        product.setSalePrice(updateProduct.salePrice());
        product.setCostPrice(updateProduct.costPrice());
        product.setStockQuantity(updateProduct.stockQuantity());
        product.setUnit(updateProduct.unit());

        return productRepo.save(product);

    }

    public Product deleteProduct(UUID id) {

        Product product = productRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado."));
        
        this.productRepo.delete(product);
        return product;
    }
}
