package disk.api.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

import org.springframework.stereotype.Service;

import disk.api.domain.entities.Product;
import disk.api.domain.entities.Sale;
import disk.api.domain.entities.SaleProduct;
import disk.api.domain.repositories.ProductRepository;
import disk.api.domain.repositories.SaleRepository;
import disk.api.dtos.ProductResponse;
import disk.api.dtos.SaleRequest;
import disk.api.dtos.SaleResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor    
public class SaleService {

    private final SaleRepository saleRepo;
    private final ProductRepository productRepo;

    public Sale createSale(SaleRequest request) {
        
        List<Product> products = productRepo.findAllById(request.productIds());
        if (products.isEmpty()) {
            throw new RuntimeException("Produtos não encontrados.");
        }
        
        
        Sale sale = new Sale();
        sale.setData(new Date()); 

       
        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            Integer quantity = request.quantities().get(i);  
            sale.addProduct(product, quantity);
            
            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException("Estoque insuficiente");
            }

            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepo.save(product);
            
        }

       
        sale.calculateSubtotal();

        
        return saleRepo.save(sale);
    }

    public List<SaleResponse> History() {
    List<Sale> sales = saleRepo.findAll();

    return sales.stream()
        .map(sale -> new SaleResponse(
            sale.getData(),
            sale.getSaleProducts().stream()
                .map(saleProduct -> new ProductResponse(
                    saleProduct.getProduct().getId(), 
                    saleProduct.getProduct().getProductName(), 
                    saleProduct.getProduct().getSalePrice(), 
                    saleProduct.getProduct().getStockQuantity(), 
                    saleProduct.getProduct().getUnitMeasure()))
                .collect(Collectors.toList()),
            sale.getSaleProducts().stream()
                .mapToInt(SaleProduct::getQuantity)
                .sum(),
            sale.getSubtotal()
        ))
        .collect(Collectors.toList());
}

    public Sale getSaleById(UUID id) {
        return saleRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Venda não encontrada"));
    }

    public void deleteSale(UUID id) {
        Sale sale = getSaleById(id);
        saleRepo.delete(sale);
    }

    public Sale updateSale(UUID id, SaleRequest request) {
    Sale sale = getSaleById(id);

    List<Product> products = productRepo.findAllById(request.productIds());
    if (products.isEmpty()) {
        throw new RuntimeException("Produtos não encontrados.");
    }
    sale.getSaleProducts().clear();

    for (int i = 0; i < products.size(); i++) {
        Product product = products.get(i);
        Integer quantity = request.quantities().get(i);
        
        SaleProduct saleProduct = new SaleProduct(sale, product, quantity);
        sale.addSaleProduct(saleProduct);
    }

    sale.calculateSubtotal();

    return saleRepo.save(sale);
}

}