package com.tunabooking.hotel_manager_api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomRequest {

    @Schema(description = "ID of the hotel this room belongs to", example = "1")
    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    @Schema(description = "Type of the room (e.g., Single, Double, Suite)", example = "Deluxe Double")
    @NotBlank(message = "Room type is required")
    private String roomType;

    @Schema(description = "Price per night", example = "150.00")
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @Schema(description = "Maximum number of people", example = "2")
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @Schema(description = "Room description", example = "A lovely double room with a city view")
    private String description;
}
