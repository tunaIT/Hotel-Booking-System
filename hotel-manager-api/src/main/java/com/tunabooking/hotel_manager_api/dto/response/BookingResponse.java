package com.tunabooking.hotel_manager_api.dto.response;

import com.tunabooking.hotel_manager_api.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {

    private Long id;
    private String userEmail;
    private String roomType;
    private String hotelName;
    private String hotelCity;
    private Double hotelRating;
    private Integer roomCapacity;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private LocalDateTime createdAt;
}
