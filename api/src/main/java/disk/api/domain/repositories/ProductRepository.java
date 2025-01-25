package disk.api.domain.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import disk.api.domain.entities.Product;
import java.util.List;
import disk.api.domain.enums.Category;



@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{
    List<Product> findByDeletedAtIsNull();
    List<Product> findByCategory(Category category);

}
