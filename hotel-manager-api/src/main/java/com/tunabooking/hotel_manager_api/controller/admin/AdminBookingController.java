package com.tunabooking.hotel_manager_api.controller.admin;

import com.tunabooking.hotel_manager_api.dto.request.UpdateBookingStatusRequest;
import com.tunabooking.hotel_manager_api.dto.response.BookingResponse;
import com.tunabooking.hotel_manager_api.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin Booking Management", description = "APIs for administrators to manage hotel bookings")
@RestController
@RequestMapping("/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final BookingService bookingService;

    @Operation(summary = "Get all bookings", description = "Retrieve a list of all hotel bookings in the system")
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @Operation(summary = "Get a booking by ID", description = "Retrieve detailed information of a specific booking by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @Operation(summary = "Update booking status", description = "Update the status of a specific booking")
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable Long id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request));
    }

}
