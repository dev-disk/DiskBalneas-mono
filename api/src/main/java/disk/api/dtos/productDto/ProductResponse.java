package disk.api.dtos.productDto;

import java.util.Optional;

import disk.api.domain.enums.Category;


public record ProductResponse(

    Long id,
    String productName,
    Category category,
    Double salePrice,
    Optional <Double> costPrice,
    Integer stockQuantity,
    String unitMeasure
    
) {}
