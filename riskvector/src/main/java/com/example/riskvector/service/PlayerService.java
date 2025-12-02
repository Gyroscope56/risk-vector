package com.example.riskvector.service;

import com.example.riskvector.model.Player;
import com.example.riskvector.repo.PlayerRepository;
import org.springframework.stereotype.Service;

@Service
public class PlayerService {
  private final PlayerRepository playerRepository;
  public PlayerService(PlayerRepository playerRepository) {
    this.playerRepository = playerRepository;
  }
  public void createPlayer() {
    playerRepository.save(new Player());
  }
}
