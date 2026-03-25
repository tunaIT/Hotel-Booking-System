package com.tunabooking.hotel_manager_api.controller.admin;

import com.tunabooking.hotel_manager_api.dto.request.HotelRequest;
import com.tunabooking.hotel_manager_api.dto.response.HotelResponse;
import com.tunabooking.hotel_manager_api.dto.response.ApiResponse;
import com.tunabooking.hotel_manager_api.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/hotels")
@RequiredArgsConstructor
public class AdminHotelController {

    private final HotelService hotelService;

    @Operation(summary = "Create a new hotel", description = "Add a new hotel to the system")
    @PostMapping
    public ResponseEntity<ApiResponse<HotelResponse>> createHotel(@Valid @RequestBody HotelRequest request) {
        HotelResponse response = hotelService.createHotel(request);
        return new ResponseEntity<>(ApiResponse.success("Hotel created successfully", response), HttpStatus.CREATED);
    }

    @Operation(summary = "Update a hotel", description = "Update the details of an existing hotel by its ID")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HotelResponse>> updateHotel(
            @PathVariable Long id,
            @Valid @RequestBody HotelRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Hotel updated successfully", hotelService.updateHotel(id, request)));
    }

    @Operation(summary = "Delete a hotel", description = "Remove a hotel from the system by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(ApiResponse.success("Hotel deleted successfully", null));
    }
}
