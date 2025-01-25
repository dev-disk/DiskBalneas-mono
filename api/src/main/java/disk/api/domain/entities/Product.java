package disk.api.domain.entities;

import java.time.LocalDateTime;
import java.util.List;

import disk.api.domain.enums.Category;
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
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")
    @SequenceGenerator(name = "product_seq", sequenceName = "product_seq", initialValue = 1, allocationSize = 1)
    private Long id;
    
    private String productName;

    private Category category;
    
    private Double salePrice;
    
    private Double costPrice;
    
    private Integer stockQuantity;
    
    private String unitMeasure;

    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<SaleProduct> saleProducts;

    @OneToMany(mappedBy = "ice")
    private List<Combo> iceCombos;

    @OneToMany(mappedBy = "drink")
    private List<Combo> drinkCombos;

    @OneToMany(mappedBy = "energyDrink")
    private List<Combo> energyDrinkCombos;


}
