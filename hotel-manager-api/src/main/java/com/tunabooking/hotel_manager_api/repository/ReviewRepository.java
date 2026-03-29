package com.tunabooking.hotel_manager_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tunabooking.hotel_manager_api.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT r FROM Review r JOIN FETCH r.user JOIN FETCH r.hotel WHERE r.hotel.id = :hotelId ORDER BY r.createdAt DESC")
    List<Review> findByHotelIdOrderByCreatedAtDesc(@Param("hotelId") Long hotelId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.hotel.id = :hotelId")
    Double findAverageRatingByHotelId(@Param("hotelId") Long hotelId);
}
