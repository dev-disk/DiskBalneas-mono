package disk.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import disk.api.services.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/statistics")
@Tag(name = "Statistics")
@RequiredArgsConstructor
public class StatisticsController {

  private final StatisticsService statisticsService;

  @Operation(summary = "Retorna os faturamentos mensais.", method = "GET")
  @GetMapping()
  public ResponseEntity invoiced() {

    var response = this.statisticsService.getInvoiced();
    return ResponseEntity.status(response.getStatus()).body(response);
  }

}
