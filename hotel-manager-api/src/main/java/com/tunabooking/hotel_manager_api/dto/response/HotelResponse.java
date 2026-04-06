package com.tunabooking.hotel_manager_api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HotelResponse implements Serializable {

    @Schema(description = "Hotel ID", example = "1")
    private Long id;

    @Schema(description = "Name of the hotel", example = "The Grand Hotel")
    private String name;

    @Schema(description = "City where the hotel is located", example = "Hanoi")
    private String city;

    @Schema(description = "Description of the hotel", example = "A luxury 5-star hotel in the center of Hanoi")
    private String description;

    @Schema(description = "Rating of the hotel", example = "4.5")
    private Double rating;

    @Schema(description = "Time when the hotel was created", example = "2026-03-16T10:00:00")
    private LocalDateTime createdAt;
}
