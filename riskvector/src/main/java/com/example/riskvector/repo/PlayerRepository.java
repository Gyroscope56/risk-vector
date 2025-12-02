package com.example.riskvector.repo;

import com.example.riskvector.model.Player;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long>{
    
}
