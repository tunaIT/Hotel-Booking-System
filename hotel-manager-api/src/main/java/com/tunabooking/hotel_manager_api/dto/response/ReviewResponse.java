package com.tunabooking.hotel_manager_api.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private String userName;
    private String hotelName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
