package disk.api.dtos.productDto;

import disk.api.domain.enums.Category;
import disk.api.domain.enums.UnitMeasure;

public record ProductRequest(

 Category category,
 String productName,
 Double salePrice,
 Double costPrice,
 Integer stockQuantity,
 UnitMeasure unitMeasure
 
) {}
