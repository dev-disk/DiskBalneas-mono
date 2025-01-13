package disk.api.dtos.saleDto;

import java.util.Date;
import java.util.List;

import disk.api.dtos.productDto.ProductResponse;

public record SaleResponse(

    Date data,
    List<ProductResponse> products,
    Integer quantity,
    Double subtotal
    
) {}
