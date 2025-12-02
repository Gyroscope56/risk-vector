package com.example.riskvector.service;

import com.example.riskvector.model.Game;
import com.example.riskvector.repo.GameRepository;

import java.time.LocalDateTime;

public class GameService {
    private final GameRepository gameRepository;
    public GameService(GameRepository g) {
        this.gameRepository = g;
    }    
    public Game getGame(Long id) throws Exception {
        return gameRepository.findById(id)
            .orElseThrow(() -> new Exception("Ship not found"));
    }
    public void createGame() {
        gameRepository.save(new Game());
    }
    public void save(Game game) {
        gameRepository.save(game);
    }
}
