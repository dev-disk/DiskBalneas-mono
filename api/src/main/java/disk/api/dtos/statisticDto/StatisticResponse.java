package disk.api.dtos.statisticDto;

import java.time.ZonedDateTime;

public record StatisticResponse(
  ZonedDateTime date,
  Double totalInvoiced,
  Integer totalSaleQuantity,
  Double totalProfit
) {}
