package com.example.riskvector.service;

import com.example.riskvector.model.Player;
import com.example.riskvector.model.Ship;
import com.example.riskvector.model.Weapon;
import com.example.riskvector.model.enums.ShipType;
import com.example.riskvector.repo.PlayerRepository;
import com.example.riskvector.repo.ShipRepository;

public class ShipService {
  private final ShipRepository shipRepository;
  private final PlayerRepository playerRepository;

  public class MoveShipRequest {
    public Long shipId;
    public int q;
    public int r;
    public int s;
  }

  public class ShootShipRequest {
    public Long attackerId;
    public Long targetId;
    public int weaponIndex;
  }
  public ShipService(ShipRepository shipRepository, PlayerRepository playerRepository) {
    this.shipRepository = shipRepository;
    this.playerRepository = playerRepository;
  }
  public Ship getShip(Long id) throws Exception {
    return shipRepository.findById(id)
        .orElseThrow(() -> new Exception("Ship not found"));
  }
  public void createShip(String type, Long playerID) throws Exception {
      Player p = playerRepository.findById(playerID).orElseThrow(() -> new Exception("Player not found"));
      ShipType shipType = ShipType.valueOf(type);
      Ship ship = new Ship(shipType, p);
      shipRepository.save(ship);
  }
  public void setShip(Ship ship) {
    shipRepository.save(ship);
  }

  public Ship moveShip(MoveShipRequest m) throws Exception {
    Ship ship = shipRepository.findById(m.shipId).orElseThrow(() -> new Exception("Ship not found"));
    int dist = ship.calculateHexDistance(m.q, m.r, m.s);
    if (dist <= ship.getMovement()) {
      // Great! you can move!
      ship.setQ(m.q);
      ship.setR(m.r);
      ship.setS(m.s);
      return shipRepository.save(ship);
    } else {
      // No bueno. throw an exception;
      throw new Exception("Destination tile too far away");
    }
  }

  public Ship shootShip(ShootShipRequest s) throws Exception {
    Ship target = shipRepository.findById(s.targetId).orElseThrow(() -> new Exception("Ship not found"));
    Ship attacker = shipRepository.findById(s.attackerId).orElseThrow(() -> new Exception("Ship not found"));
    Weapon w = attacker.getWeapons().get(s.weaponIndex);
    attacker.shoot(target, w);
    return shipRepository.save(target);
  }
}
