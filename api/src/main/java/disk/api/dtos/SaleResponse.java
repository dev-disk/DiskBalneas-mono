package disk.api.dtos;

import java.util.Date;
import java.util.List;

public record SaleResponse(

    Date data,
    List<ProductResponse> products,
    Integer quantity,
    Double subtotal
    
) {}
