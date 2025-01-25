package disk.api.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
 

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import disk.api.domain.entities.Combo;
import disk.api.domain.entities.Product;
import disk.api.domain.entities.Sale;
import disk.api.domain.entities.SaleProduct;
import disk.api.domain.repositories.ComboRepository;
import disk.api.domain.repositories.ProductRepository;
import disk.api.domain.repositories.SaleRepository;
import disk.api.dtos.productDto.ProductResponse;
import disk.api.dtos.responsesDto.ServiceResponse;
import disk.api.dtos.saleDto.SaleRequest;
import disk.api.dtos.saleDto.SaleResponse;
import disk.api.infrastructure.security.TokenService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor    
public class SaleService {

    private final SaleRepository saleRepo;
    private final ProductRepository productRepo;
    private final ComboRepository comboRepo;
    private final TokenService tokenService;

    public ServiceResponse<String> createSale(SaleRequest request) {

        var response = new ServiceResponse<String>();
        
        List<Product> products = productRepo.findAllById(request.productIds());
        List<Combo> combos = comboRepo.findAllById(request.productIds());

        if (products.isEmpty()) {
            response.setStatus(HttpStatus.BAD_REQUEST);
            response.setMessage("Não existem itens cadastrados.");
            return response;
        }

        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            Integer quantity = request.quantities().get(i);  
            
            if (product.getStockQuantity() < quantity) {
                response.setStatus(HttpStatus.BAD_REQUEST);
                response.setMessage("Estoque insuficiente.");
            }
        }

        Sale sale = new Sale();
        sale.setData(new Date());

        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);

            Integer quantity = request.quantities().get(i);
            sale.addProduct(product, quantity);

            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepo.save(product);
        }

        sale.calculateSubtotal();
        
        saleRepo.save(sale);

        response.setStatus(HttpStatus.OK);
        response.setMessage("Venda registrada com sucesso!");
        return response;
    }

    public ServiceResponse<List<SaleResponse>> History() {

        List<Sale> sales = saleRepo.findAll();
    
        var response = new ServiceResponse<List<SaleResponse>>();
    
        List<SaleResponse> saleResponses = sales.stream()
            .map(sale -> {
                
                List<ProductResponse> productResponses = sale.getSaleProducts().stream()
                    .map(saleProduct -> new ProductResponse(
                        saleProduct.getProduct().getId(),
                        saleProduct.getProduct().getProductName(),
                        saleProduct.getProduct().getSalePrice(),
                        saleProduct.getProduct().getStockQuantity(),
                        saleProduct.getProduct().getUnitMeasure()))
                    .collect(Collectors.toList());
                
                
                List<Integer> quantities = sale.getSaleProducts().stream()
                    .map(SaleProduct::getQuantity)
                    .collect(Collectors.toList());
                
                return new SaleResponse(
                    sale.getData(),
                    productResponses,
                    quantities,  
                    sale.getSubtotal()
                );
            })
            .sorted((sA, sB) -> sB.data().compareTo(sA.data()))
            .collect(Collectors.toList());
    
        response.setData(saleResponses);
        response.setStatus(HttpStatus.OK);
        return response;
    }

    public Sale getSaleById(Long id) {
        return saleRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Venda não encontrada"));
    }

    public void deleteSale(Long id) {
        Sale sale = getSaleById(id);
        saleRepo.delete(sale);
    }

    public Sale updateSale(Long id, SaleRequest request) {
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