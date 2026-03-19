package com.tunabooking.hotel_manager_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tunabooking.hotel_manager_api.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHotelIdOrderByCreatedAtDesc(Long hotelId);
}
