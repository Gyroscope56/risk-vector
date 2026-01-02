package com.example.riskvector.engine;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.example.riskvector.dto.AttackCommand;
import com.example.riskvector.dto.MoveShipCommand;
import com.example.riskvector.model.Game;
import com.example.riskvector.model.Ship;

public class GameEngine {
    private Game game;
    public void startGame(Game game) {
        if (!game.getStatus().equals("WAITING")) {
            throw new IllegalStateException("Game already started!");
        }
        List<Ship> ships = aliveShips(game);
        if (ships.isEmpty()) {
            game.setStatus("ENDED");
            return;
        }
        // Temporary initiative: random
        Collections.shuffle(ships);
        game.setActiveShipId(ships.get(0).getId());
        game.setTurnNumber(1);
        game.setStatus("ACTIVE");
    }

    public void moveShip(Game game, MoveShipCommand cmd) {
        Ship ship = findShip(game, cmd.shipId());

        if (!game.isShipActive(ship.getId())) {
            throw new IllegalStateException("Not this ship's turn");
        }

        int distance = hexDistance(
            ship.getQ(), ship.getR(), ship.getS(),
            cmd.q(), cmd.r(), cmd.s()
        );

        if (distance > ship.getMovement()) {
            throw new IllegalStateException("Move too far");
        }

        ship.setQ(cmd.q());
        ship.setR(cmd.r());
        ship.setS(cmd.s());
    }


    public void shoot(Game game, AttackCommand cmd) {
        Ship attacker = findShip(game, cmd.attackerId());
        Ship target = findShip(game, cmd.targetId());

        if (!game.isShipActive(attacker.getId())) {
            throw new IllegalStateException("Not your turn");
        }
        // Modify with actual attack logic
        target.setHp(target.getHp() - 1);
    }

    public void endTurn(Game game) {
        if (!game.getStatus().equals("ACTIVE")) {
            throw new IllegalStateException("Game not active");
        }

        List<Ship> ships = aliveShips(game);

        if (ships.size() <= 1) {
            game.setStatus("ENDED");
            return;
        }

        Long currentId = game.getActiveShipId();

        int currentIndex = -1;
        for (int i = 0; i < ships.size(); i++) {
            if (ships.get(i).getId().equals(currentId)) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex == -1) {
            throw new IllegalStateException("Active ship missing");
        }

        int nextIndex = (currentIndex + 1) % ships.size();

        if (nextIndex == 0) {
            game.setTurnNumber(game.getTurnNumber() + 1);
        }

        game.setActiveShipId(ships.get(nextIndex).getId());
    }
    private List<Ship> aliveShips(Game game) {
        return game.getShips().stream()
            .filter(s -> !s.getDestroyed())
            .collect(Collectors.toList());
    }

    private Ship findShip(Game game, Long shipId) {
        return game.getShips().stream()
            .filter(s -> s.getId().equals(shipId))
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("Ship not found"));
    }

}
