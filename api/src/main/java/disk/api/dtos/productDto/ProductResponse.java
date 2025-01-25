package disk.api.dtos.productDto;


public record ProductResponse(

    Long id,
    String productName,
    Double salePrice,
    Integer stockQuantity,
    String unitMeasure
    
) {}
