package disk.api.domain.entities;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import disk.api.domain.enums.Category;
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
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String productName;

    private Category category;
    
    private Double salePrice;
    
    private Double costPrice;
    
    private Integer stockQuantity;
    
    private String unitMeasure;

    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<SaleProduct> saleProducts;
}
