package com.example.riskvector.model;

import com.example.riskvector.model.enums.Slot;
import jakarta.persistence.*;

@Entity
@Table(name = "weapons")
public class Weapon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // "Laser Cannon", "Plasma Blaster", etc.

    private int shots;

    @Column(name = "min_range")
    private int minRange;

    @Column(name = "max_range")
    private int maxRange;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Slot slot;

    private double accuracy;

    private int damage;

    // === Constructors ===
    public Weapon() {} // JPA requires a no-arg constructor

    public Weapon(String name, int shots, int minRange, int maxRange, Slot slot, double accuracy, int damage) {
        this.name = name;
        this.shots = shots;
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.slot = slot;
        this.accuracy = accuracy;
        this.damage = damage;
    }

    // === Getters and Setters ===
    public Long getId() { return id; }
    
    public double getAcc() { return accuracy; }
    public void setAcc(double acc) { this.accuracy = acc; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getShots() { return shots; }
    public void setShots(int shots) { this.shots = shots; }

    public int getMinRange() { return minRange; }
    public void setMinRange(int minRange) { this.minRange = minRange; }

    public int getMaxRange() { return maxRange; }
    public void setMaxRange(int maxRange) { this.maxRange = maxRange; }

    public Slot getSlot() { return slot; }
    public void setSlot(Slot slot) { this.slot = slot; }

    public int getDam() { return damage; }
    public void setDam(int damage) { this.damage = damage; }

    @Override
    public String toString() {
        return String.format("%s [%s slot, %d dmg, %.2f acc, %d shots, range %d-%d]",
                name, slot, damage, accuracy, shots, minRange, maxRange);
    }
}
