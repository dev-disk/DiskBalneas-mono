package disk.api.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import disk.api.domain.entities.Combo;
import disk.api.domain.entities.Product;
import disk.api.domain.repositories.ComboRepository;
import disk.api.domain.repositories.ProductRepository;
import disk.api.dtos.comboDto.ComboRequest;
import disk.api.dtos.comboDto.ComboResponse;
import disk.api.dtos.responsesDto.ServiceResponse;

@Service
public class ComboService {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private ComboRepository comboRepo;

    public ServiceResponse<ComboResponse> createCombo(ComboRequest request) {
        var response = new ServiceResponse<ComboResponse>();
        var isRemoved = false;

        Optional<Product> iceOpt = productRepo.findById(request.iceId());
        Optional<Product> drinkOpt = productRepo.findById(request.drinkId());
        Optional<Product> energyDrinkOpt = productRepo.findById(request.energyDrinkId());

        Product ice = iceOpt.get();
        Product drink = drinkOpt.get();
        Product energyDrink = energyDrinkOpt.get();

        Combo combo = new Combo();
        combo.setComboName(request.comboName());
        combo.setIce(ice);
        combo.setDrink(drink);
        combo.setEnergyDrink(energyDrink);

        Double price = ice.getSalePrice() + drink.getSalePrice() + energyDrink.getSalePrice()
                + ((ice.getSalePrice() + drink.getSalePrice() + energyDrink.getSalePrice()) * 122 / 100);
        combo.setPrice(price);

        this.comboRepo.save(combo);

        ice.setStockQuantity(ice.getStockQuantity() - 1);
        drink.setStockQuantity(drink.getStockQuantity() - 1);
        energyDrink.setStockQuantity(energyDrink.getStockQuantity() - 1);

        isRemoved = true;

        if (isRemoved) {
            productRepo.save(ice);
            productRepo.save(drink);
            productRepo.save(energyDrink);
        }

        var comboResponse = new ComboResponse(
                combo.getId(),
                combo.getComboName(),
                combo.getIce().getId(),
                combo.getDrink().getId(),
                combo.getEnergyDrink().getId(), combo.getPrice());

        response.setData(comboResponse);
        response.setMessage("Combo criado com sucesso.");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    public ServiceResponse<List<ComboResponse>> getCombos() {
        List<Combo> combos = comboRepo.findAll();
        var response = new ServiceResponse<List<ComboResponse>>();

        List<ComboResponse> comboResponses = combos.stream()
                .map(combo -> new ComboResponse(
                        combo.getId(),
                        combo.getComboName(),
                        combo.getIce().getId(),
                        combo.getDrink().getId(),
                        combo.getEnergyDrink().getId(),
                        combo.getPrice()))

                .collect(Collectors.toList());

        response.setData(comboResponses);
        response.setStatus(HttpStatus.OK);
        return response;

    }
}
