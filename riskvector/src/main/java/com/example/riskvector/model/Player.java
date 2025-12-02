package com.example.riskvector.model;

import java.util.*;
import jakarta.persistence.*;


@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private UUID playerUuid = UUID.randomUUID();
    private String name;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ship> fleet = new ArrayList<>();

    public Player() {}

    public Player(String name, Game game) {
        this.name = name;
        this.game = game;
    }

    public void addShip(Ship ship) {
        ship.setPlayer(this);
        this.fleet.add(ship);
    }

    // Getters and setters here
}
