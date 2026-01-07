package com.example.riskvector.dto;

public class MoveShipCommand {
    private int q;
    private int r;
    private int s;
    private Long shipId;
    public int q() {
        return this.q;
    }
    public int r() {
        return this.r;
    }
    public int s() {
        return this.s;
    }
    public Long shipId() {
        return this.shipId;
    }
}
