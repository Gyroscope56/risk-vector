package com.example.riskvector.repo;

import com.example.riskvector.model.Weapon;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

@Repository
public interface WeaponRepository extends JpaRepository<Weapon, Long>{
    
}
