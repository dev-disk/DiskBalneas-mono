package disk.api.dtos.saleDto;

import java.util.Date;
import java.util.List;

import disk.api.domain.enums.Payment;
import disk.api.dtos.productDto.ProductResponse;

public record SaleResponse(

    Date date,
    List<ProductResponse> products,
    List<Integer> quantities,
    Double subtotal,
    Payment payment
    
) {}
