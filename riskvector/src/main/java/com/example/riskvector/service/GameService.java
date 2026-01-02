package com.example.riskvector.service;

import com.example.riskvector.model.Game;
import com.example.riskvector.repo.GameRepository;

public class GameService {
    private final GameRepository gameRepository;
    public GameService(GameRepository g) {
        this.gameRepository = g;
    }    
    public Game getGame(Long id) throws Exception {
        Game temp = gameRepository.findById(id).get();
        if (temp == null) {
            throw new Exception("Game not found");
        }
        return temp;
    }
    public void createGame() {
        Game newGame = new Game();
        
        gameRepository.save(newGame);
    }
}
