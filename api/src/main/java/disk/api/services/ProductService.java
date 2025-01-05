package disk.api.services;

import java.util.List;
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
        product.setUnitMeasure(ProductRegister.unitMeasure());

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
            p.getUnitMeasure()
        ))
        .collect(Collectors.toList());
    }

}
