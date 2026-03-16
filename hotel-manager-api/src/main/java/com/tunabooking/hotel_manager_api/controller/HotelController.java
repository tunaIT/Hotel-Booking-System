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

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;
    private final RoomService roomService;

    @Operation(summary = "Get all hotels", description = "Retrieve a list of all hotels")
    @GetMapping
    public ResponseEntity<List<HotelResponse>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
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
}
