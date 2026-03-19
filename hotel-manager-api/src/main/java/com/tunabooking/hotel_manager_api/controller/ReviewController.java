package com.tunabooking.hotel_manager_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tunabooking.hotel_manager_api.dto.request.ReviewRequest;
import com.tunabooking.hotel_manager_api.dto.response.ReviewResponse;
import com.tunabooking.hotel_manager_api.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @Operation(summary = "create a review", description = "create a review for the hotel which user has booked")
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

}
