package com.example.riskvector.repo;

import com.example.riskvector.model.Ship;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

@Repository
public interface ShipRepository extends JpaRepository <Ship, Long>{
    
}
