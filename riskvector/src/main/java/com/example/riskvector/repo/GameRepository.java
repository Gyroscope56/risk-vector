package com.example.riskvector.repo;

import com.example.riskvector.model.Game;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

@Repository
public interface GameRepository extends JpaRepository<Game, Long>{
       
}