package com.example.riskvector.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Ship> ships = new ArrayList<>();

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Player> players = new ArrayList<>();

    private int turnNumber;

    @Column(length = 10000)
    private String mapStateJson;

    private String stateHash;

    private Long activeShipId;
    private int activeShipIndex;

    public Game() {
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
        this.status = "WAITING";
        this.turnNumber = 1;
    }

    @PreUpdate
    public void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    public void advanceTurn() {
        this.turnNumber++;
    }

    public void addShip(Ship ship) {
        ship.setGame(this);
        this.ships.add(ship);
    }

    public boolean isShipActive(Long shipId) {
        return shipId.equals(activeShipId);
    }
    public List<Ship> getShips() {
        return this.ships;
    }
    public String getStatus() {
        return this.status;
    }
    public void setStatus(String s) {
        this.status = s;
    }
    public void setTurnNumber(int i) {
        this.turnNumber = i;
    }
    public void setActiveShipId(Long id) {
        this.activeShipId = id;
    }
    public Long getActiveShipId() {
        return this.activeShipId;
    }
    public void setActiveShipIndex(int index) {
        this.activeShipIndex = index;
    }
    public int getActiveShipIndex() {
        return this.activeShipIndex;
    }
    public int getTurnNumber() {
        return this.turnNumber;
    }
}