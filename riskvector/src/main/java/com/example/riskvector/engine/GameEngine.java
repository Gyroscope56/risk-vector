package com.example.riskvector.engine;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.example.riskvector.dto.AttackCommand;
import com.example.riskvector.dto.EndTurnCommand;
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

        int distance = ((Math.abs(ship.getQ()-cmd.q())) + (Math.abs(ship.getR()-cmd.r())) + (Math.abs(ship.getS()-cmd.s())))/2;

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
        attacker.shoot(target, null);
    }

    public void endTurn(Game game, EndTurnCommand cmd) {
        if (!game.getStatus().equals("ACTIVE")) {
            throw new IllegalStateException("Game not active");
        }
        if (!cmd.id().equals(game.getActiveShipId())) {
            throw new IllegalStateException("Ship " + cmd.id() + " is trying to end turn, while it is the turn of Ship " + game.getActiveShipId());
        }
        List<Ship> ships = aliveShips(game);
        if (ships.size() <= 1) {
            game.setStatus("ENDED");
            return;
        }

        Long currentId = game.getActiveShipId();
        int currentIndex = game.getActiveShipIndex();

        while (currentIndex < ships.size()) {
            currentIndex ++;
            if (!ships.get(currentIndex).getDestroyed()) {
                break;
            }
        }
        if (currentIndex < ships.size()) {
            game.setActiveShipIndex(currentIndex);
            game.setActiveShipId(ships.get(currentIndex).getId());
        } else {
            // Next round begins
            currentIndex = 0;
            game.advanceTurn();
            game.setActiveShipIndex(0);
            game.setActiveShipId(ships.get(currentIndex).getId());
        }
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
