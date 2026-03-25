package com.tunabooking.hotel_manager_api.controller;

import com.tunabooking.hotel_manager_api.dto.request.BookingRequest;
import com.tunabooking.hotel_manager_api.dto.response.BookingResponse;
import com.tunabooking.hotel_manager_api.dto.response.ApiResponse;
import com.tunabooking.hotel_manager_api.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Create a new booking", description = "Book a room for specific dates")
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(request);
        return new ResponseEntity<>(ApiResponse.success("Booking created successfully", response), HttpStatus.CREATED);
    }

    @Operation(summary = "Get my bookings", description = "Get all bookings for the currently authenticated user")
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings() {
        List<BookingResponse> responses = bookingService.getMyBookings();
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", responses));
    }

    @Operation(summary = "Delete a booking", description = "Delete a booking by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully", null));
    }
}
