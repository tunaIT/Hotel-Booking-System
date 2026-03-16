package com.tunabooking.hotel_manager_api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {

    @Schema(description = "Room ID", example = "1")
    private Long id;

    @Schema(description = "ID of the hotel this room belongs to", example = "1")
    private Long hotelId;

    @Schema(description = "Type of the room", example = "Deluxe Double")
    private String roomType;

    @Schema(description = "Price per night", example = "150.00")
    private BigDecimal price;

    @Schema(description = "Maximum number of people", example = "2")
    private Integer capacity;

    @Schema(description = "Room description", example = "A lovely double room with a city view")
    private String description;

    @Schema(description = "Time when the room was created", example = "2026-03-16T10:00:00")
    private LocalDateTime createdAt;
}
