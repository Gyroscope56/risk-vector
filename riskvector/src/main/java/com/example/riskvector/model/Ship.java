package com.example.riskvector.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.example.riskvector.model.enums.ShipType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ships")
public class Ship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    @Enumerated(EnumType.STRING)
    private ShipType type;

    private int maxHealth;
    private int currHealth;
    private int maxShield;
    private int currShield;
    @Getter
    @Setter
    private int movement;
    private double size;

    @Getter
    @Setter
    private int q;
    @Getter
    @Setter
    private int r;
    @Getter
    @Setter
    private int s;

    @Getter
    @OneToMany(mappedBy = "ship", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Weapon> weapons = new ArrayList<>();

    public Ship() {}

    public Ship(ShipType type, Player player) {
        this.type = type;
        this.player = player;
        initializeStats();
    }

    public void initializeStats() {
        switch (type) {
            case FIGHTER -> { this.movement = 7; this.maxHealth = 1000; this.currHealth = 1000; this.maxShield = 0; this.currShield = 0; this.size = 0.25; }
            case FRIGATE -> { this.movement = 5; this.maxHealth = 8000; this.currHealth = 8000; this.maxShield = 4000; this.currShield = 4000; this.size = 1; }
            case DESTROYER -> { this.movement = 4; this.maxHealth = 16000; this.currHealth = 16000; this.maxShield = 8000; this.currShield = 8000; this.size = 2; }
            case CRUISER -> { this.movement = 3; this.maxHealth = 32000; this.currHealth = 32000; this.maxShield = 16000; this.currShield = 16000; this.size = 3; }
            case BATTLESHIP -> { this.movement = 2; this.maxHealth = 56000; this.currHealth = 56000; this.maxShield = 48000; this.currShield = 48000; this.size = 4; }
            case CARRIER -> { this.movement = 2; this.maxHealth = 50000; this.currHealth = 50000; this.maxShield = 50000; this.currShield = 50000; this.size = 5; }
            case DREADNOUGHT -> { this.movement = 2; this.maxHealth = 80000; this.currHealth = 80000; this.maxShield = 60000; this.currShield = 60000; this.size = 6; }
            case TITAN -> { this.movement = 1; this.maxHealth = 200000; this.currHealth = 200000; this.maxShield = 120000; this.currShield = 120000; this.size = 8; }
        }
    }

    public void shoot(Ship target, Weapon weapon) {
        double likelihood = weapon.getAcc();
        switch (target.type) {
            case FIGHTER -> likelihood -= 0.2;
            case FRIGATE -> likelihood -= 0.1;
            case CRUISER -> likelihood += 0.5;
            case BATTLESHIP -> likelihood += 0.1;
            case CARRIER -> likelihood += 0.1;
            case DREADNOUGHT -> likelihood += 0.2;
            case TITAN -> likelihood += 0.4;
        }

        Random random = new Random();
        double accuracy = random.nextDouble();
        int dist = calculateHexDistance(target.q, target.r, target.s);
        if (dist < weapon.getMinRange()) {
            if (dist == weapon.getMinRange() - 1) accuracy *= 0.5;
            else accuracy = 0;
        } else if (dist < weapon.getMaxRange()) {
            if (dist == weapon.getMaxRange() + 1) accuracy *= 0.5;
            else accuracy = 0;
        }
        for (int i = 0; i < weapon.getShots(); i++) {
            if (accuracy <= likelihood) {
                if (target.currShield > 0)
                    target.currShield = Math.max(0, target.currShield - weapon.getDam());
                else
                    target.currHealth = Math.max(0, target.currHealth - weapon.getDam());
            }
        }
    }

    public int calculateHexDistance(int q2, int r2, int s2) {
        return (Math.abs(this.q - q2) + Math.abs(this.r - r2) + Math.abs(this.s - s2)) / 2;
    }

    public void setGame(Game game) { this.game = game; }

    public void setPlayer(Player player) { this.player = player; }

    public Long getId() {
        return this.id;
    }
    
    public boolean getDestroyed() {
        return this.currHealth == 0;
    }
}
