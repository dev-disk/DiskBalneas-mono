package disk.api.domain.repositories;

 

import org.springframework.data.jpa.repository.JpaRepository;

import disk.api.domain.entities.Sale;

public interface SaleRepository extends JpaRepository <Sale, Long> {

}
