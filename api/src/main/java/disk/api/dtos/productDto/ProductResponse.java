package disk.api.dtos.productDto;

import java.util.UUID;

public record ProductResponse(

    UUID id,
    String productName,
    Double salePrice,
    Integer stockQuantity,
    String unitMeasure
    
) {}
