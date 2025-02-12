package disk.api.domain.entities;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import disk.api.domain.enums.Payment;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")
    @SequenceGenerator(name = "product_seq", sequenceName = "product_seq", initialValue = 1, allocationSize = 1)
    private Long id;

    private ZonedDateTime date;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<SaleProduct> saleProducts = new ArrayList<>();

    private Double subtotal;

    private Payment payment;

    private Boolean queroDelivery;

    public void calculateSubtotal() {
        if (saleProducts != null) {
            double total = 0.0;
            for (SaleProduct saleProduct : saleProducts) {
                if (saleProduct.getProduct() != null) {
                    total += saleProduct.getProduct().getSalePrice() * saleProduct.getQuantity();
                }
                if (saleProduct.getCombo() != null) {
                    total += saleProduct.getCombo().getPrice() * saleProduct.getQuantity();
                }
                
            }
            BigDecimal adjustedSubtotal = new BigDecimal(total).setScale(2, RoundingMode.HALF_UP);
            this.subtotal = adjustedSubtotal.doubleValue();
        }
    }

    public void addProduct(Product product, Integer quantity) {
        SaleProduct saleProduct = new SaleProduct(this, product, quantity);
        this.saleProducts.add(saleProduct);
    }

    public void addCombo(Combo combo, Integer quantity) {
        SaleProduct saleProduct = new SaleProduct(this, combo, quantity);
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

