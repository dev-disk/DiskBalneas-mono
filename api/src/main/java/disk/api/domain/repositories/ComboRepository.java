package disk.api.domain.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import disk.api.domain.entities.Combo;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Long> {

}
