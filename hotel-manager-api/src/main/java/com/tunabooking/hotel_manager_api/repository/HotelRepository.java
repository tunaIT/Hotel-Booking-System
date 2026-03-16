package com.tunabooking.hotel_manager_api.repository;

import com.tunabooking.hotel_manager_api.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
