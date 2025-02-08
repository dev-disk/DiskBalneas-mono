package disk.api.dtos.saleDto;

import java.time.ZonedDateTime;
import java.util.List;

import disk.api.domain.enums.Payment;
import disk.api.dtos.productDto.ProductResponse;

public record SaleResponse(

    ZonedDateTime date,
    List<ProductResponse> products,
    List<Integer> quantities,
    Double subtotal,
    Payment payment,
    Boolean queroDelivery
    
) {}
