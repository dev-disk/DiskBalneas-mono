package disk.api.domain.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import disk.api.domain.entities.Sale;

public interface SaleRepository extends JpaRepository <Sale, UUID> {

}
