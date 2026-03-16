package com.tunabooking.hotel_manager_api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HotelRequest {

    @Schema(description = "Name of the hotel", example = "The Grand Hotel")
    @NotBlank(message = "Hotel name is required")
    private String name;

    @Schema(description = "City where the hotel is located", example = "Hanoi")
    @NotBlank(message = "City is required")
    private String city;

    @Schema(description = "Description of the hotel", example = "A luxury 5-star hotel in the center of Hanoi")
    private String description;

    @Schema(description = "Rating of the hotel", example = "4.5")
    private Double rating;
}
