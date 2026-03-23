package com.tunabooking.hotel_manager_api.controller;

import com.tunabooking.hotel_manager_api.dto.response.HotelResponse;
import com.tunabooking.hotel_manager_api.dto.response.RoomResponse;
import com.tunabooking.hotel_manager_api.service.HotelService;
import com.tunabooking.hotel_manager_api.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
import com.tunabooking.hotel_manager_api.dto.response.ReviewResponse;
import com.tunabooking.hotel_manager_api.service.ReviewService;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;
    private final RoomService roomService;
    private final ReviewService reviewService;

    @Operation(summary = "Search all hotels", description = "Retrieve a paginated list of all hotels, optionally filtered by city, price range, and room capacity")
    @GetMapping
    public ResponseEntity<Page<HotelResponse>> getHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(hotelService.searchHotels(city, minPrice, maxPrice, capacity, page, size));
    }

    @Operation(summary = "Get a hotel by ID", description = "Retrieve details of a specific hotel by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<HotelResponse> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @Operation(summary = "Get rooms by hotel ID", description = "Retrieve a list of rooms belonging to a specific hotel")
    @GetMapping("/{id}/rooms")
    public ResponseEntity<List<RoomResponse>> getRoomsByHotelId(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomsByHotelId(id));
    }

    @Operation(summary = "Get reviews by hotel ID", description = "Retrieve a list of reviews belonging to a specific hotel")
    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviewsByHotelId(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsByHotelId(id));
    }
}
