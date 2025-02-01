package disk.api.dtos.saleDto;

import java.util.List;

import disk.api.domain.enums.Payment;
 

public record SaleRequest(

    List<Long> productIds,
    List<Integer> quantities,
    Payment payment

) {}
