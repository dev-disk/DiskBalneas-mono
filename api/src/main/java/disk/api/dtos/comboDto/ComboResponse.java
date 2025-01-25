package disk.api.dtos.comboDto;

public record ComboResponse(
    String comboName,
    Long iceId,
    Long drinkId,
    Long energyDrinkId,
    Double price
) {}
