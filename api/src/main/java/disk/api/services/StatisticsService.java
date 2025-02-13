package disk.api.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import disk.api.domain.entities.Combo;
import disk.api.domain.entities.Product;
import disk.api.domain.entities.Sale;
import disk.api.domain.repositories.ProductRepository;
import disk.api.domain.repositories.SaleRepository;
import disk.api.dtos.responsesDto.ServiceResponse;
import disk.api.dtos.saleDto.SaleResponse;
import disk.api.dtos.statisticDto.StatisticResponse;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {
  private final SaleRepository saleRepository;

  public ServiceResponse<List<StatisticResponse>> getInvoiced() {
    var response = new ServiceResponse<List<StatisticResponse>>();
    List<Sale> sales = saleRepository.findAll();

    Map<ZonedDateTime, StatisticResponse> monthlyTotals = sales.stream()
        .collect(Collectors.groupingBy(
            sale -> sale.getDate().withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS),
            Collectors.collectingAndThen(
                Collectors.toList(),
                list -> {
                  BigDecimal totalInvoiced = list.stream()
                      .map(sale -> BigDecimal.valueOf(sale.getSubtotal()))
                      .reduce(BigDecimal.ZERO, BigDecimal::add)
                      .setScale(2, RoundingMode.HALF_UP);

                  int totalSaleQuantity = list.size();

                  BigDecimal totalProfit = list.stream()
                      .flatMap(sale -> sale.getSaleProducts().stream())
                      .map(sp -> {
                        if (sp.getProduct() != null) {
                          Product product = sp.getProduct();
                          BigDecimal profitPerItem = BigDecimal.valueOf(product.getSalePrice())
                              .subtract(BigDecimal.valueOf(product.getCostPrice()))
                              .multiply(BigDecimal.valueOf(sp.getQuantity()));
                          return profitPerItem;
                        }
                        return BigDecimal.ZERO;
                      }).reduce(BigDecimal.ZERO, BigDecimal::add)
                      .setScale(2, RoundingMode.HALF_UP);

                  return new StatisticResponse(null, totalInvoiced.doubleValue(), totalSaleQuantity,
                      totalProfit.doubleValue());
                })));

    List<StatisticResponse> statisticResponses = monthlyTotals.entrySet().stream()
        .map(entry -> new StatisticResponse(
            entry.getKey(),
            entry.getValue().totalInvoiced(),
            entry.getValue().totalSaleQuantity(),
            entry.getValue().totalProfit()))
        .sorted((sr1, sr2) -> sr1.date().compareTo(sr2.date()))
        .collect(Collectors.toList());

    response.setData(statisticResponses);
    response.setStatus(HttpStatus.OK);
    return response;
  }

}
