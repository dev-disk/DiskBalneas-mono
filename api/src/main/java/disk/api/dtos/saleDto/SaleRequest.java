package disk.api.dtos.saleDto;

import java.util.List;
import java.util.UUID;

public record SaleRequest(

    List<UUID> productIds,
    List<Integer> quantities

) {}
