package disk.api.domain.entities;


import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Combo {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq")
    @SequenceGenerator(name = "product_seq", sequenceName = "product_seq", initialValue = 1, allocationSize = 1)
    private Long id;

    private String comboName;
    private Double price;
    private Double dose;

    @ManyToOne
    @JoinColumn(name = "ice_id")
    private Product ice;

    @ManyToOne
    @JoinColumn(name = "drink_id")
    private Product drink;

    @ManyToOne
    @JoinColumn(name = "energy_drink_id")
    private Product energyDrink;

    @OneToMany(mappedBy = "combo", cascade = CascadeType.ALL)
    private List<SaleProduct> saleProducts;

    
}
