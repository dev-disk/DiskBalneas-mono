package disk.api.dtos.comboDto;

public record ComboRequest(
    String comboName,
    Long iceId,
    Long drinkId,
    Long energyDrinkId,
    Double doseQuantity
) {}
