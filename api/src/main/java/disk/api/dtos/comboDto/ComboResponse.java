package disk.api.dtos.comboDto;

public record ComboResponse(
    Long id,
    String comboName,
    Long iceId,
    Long drinkId,
    Long energyDrinkId,
    Double price,
    Double doseQuantity
) {}
