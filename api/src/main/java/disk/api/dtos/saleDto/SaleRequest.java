package disk.api.dtos.saleDto;

import java.util.List;
 

public record SaleRequest(

    List<Long> productIds,
    List<Integer> quantities

) {}
