package com.tunabooking.hotel_manager_api.dto.request;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long hotelId;
    private int rating;
    private String comment;
}
