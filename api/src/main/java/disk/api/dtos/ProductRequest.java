package disk.api.dtos;

public record ProductRequest(

 String productName,
 Double salePrice,
 Double costPrice,
 Integer stockQuantity,
 Integer unit
 
) {}
