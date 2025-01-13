package disk.api.dtos.productDto;

import disk.api.domain.enums.Category;

public record ProductRequest(

 Category category,
 String productName,
 Double salePrice,
 Double costPrice,
 Integer stockQuantity,
 String unitMeasure
 
) {}
