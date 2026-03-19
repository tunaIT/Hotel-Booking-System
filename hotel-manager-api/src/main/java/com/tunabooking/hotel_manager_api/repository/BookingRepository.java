package com.tunabooking.hotel_manager_api.repository;

import com.tunabooking.hotel_manager_api.entity.Booking;
import com.tunabooking.hotel_manager_api.entity.BookingStatus;
import com.tunabooking.hotel_manager_api.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
            "WHERE b.room.id = :roomId " +
            "AND b.status IN :statuses " +
            "AND b.checkInDate < :checkOutDate " +
            "AND b.checkOutDate > :checkInDate")
    boolean existsOverlappingBooking(
            @Param("roomId") Long roomId,
            @Param("statuses") List<BookingStatus> statuses,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate);

    List<Booking> findByUserId(Long userId);

    Optional<Booking> findFirstByUserIdAndRoomHotelIdAndStatus(Long userId, Long hotelId, BookingStatus status);
}
