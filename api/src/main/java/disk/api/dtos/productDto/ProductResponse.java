package disk.api.dtos.productDto;

import disk.api.domain.enums.Category;


public record ProductResponse(

    Long id,
    String productName,
    Category category,
    Double salePrice,
    Integer stockQuantity,
    String unitMeasure
    
) {}
