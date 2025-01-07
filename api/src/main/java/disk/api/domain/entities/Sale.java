package disk.api.domain.entities;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sales")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Date data;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<SaleProduct> saleProducts = new ArrayList<>();

    private Double subtotal;

    public void calculateSubtotal() {
        if (saleProducts != null) {
            double total = 0.0;
            for (SaleProduct saleProduct : saleProducts) {
                total += saleProduct.getProduct().getSalePrice() * saleProduct.getQuantity();
            }
            this.subtotal = total;
        }
    }

    public void addProduct(Product product, Integer quantity) {
        SaleProduct saleProduct = new SaleProduct(this, product, quantity);
        this.saleProducts.add(saleProduct);
    }

    public void removeProduct(Product product) {
        this.saleProducts.removeIf(saleProduct -> saleProduct.getProduct().equals(product));
    }

    public void addSaleProduct(SaleProduct saleProduct) {
    this.saleProducts.add(saleProduct);
    saleProduct.setSale(this);
}


}

