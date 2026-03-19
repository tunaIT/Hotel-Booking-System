package com.tunabooking.hotel_manager_api.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.tunabooking.hotel_manager_api.dto.request.ReviewRequest;
import com.tunabooking.hotel_manager_api.dto.response.ReviewResponse;
import com.tunabooking.hotel_manager_api.entity.Booking;
import com.tunabooking.hotel_manager_api.entity.BookingStatus;
import com.tunabooking.hotel_manager_api.entity.Hotel;
import com.tunabooking.hotel_manager_api.entity.Review;
import com.tunabooking.hotel_manager_api.entity.User;
import com.tunabooking.hotel_manager_api.exception.BookingNotFoundException;
import com.tunabooking.hotel_manager_api.exception.HotelNotFoundException;
import com.tunabooking.hotel_manager_api.exception.UserNotFoundException;
import com.tunabooking.hotel_manager_api.repository.BookingRepository;
import com.tunabooking.hotel_manager_api.repository.HotelRepository;
import com.tunabooking.hotel_manager_api.repository.ReviewRepository;
import com.tunabooking.hotel_manager_api.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found"));
        Booking booking = bookingRepository.findFirstByUserIdAndRoomHotelIdAndStatus(currentUser.getId(), hotel.getId(), BookingStatus.CONFIRMED)
                .orElseThrow(() -> new BookingNotFoundException("Cannot review without a confirmed booking for this hotel"));
        Review review = Review.builder()
                .user(currentUser)
                .hotel(hotel)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        reviewRepository.save(review);
        return ReviewResponse.builder()
                .userName(review.getUser().getName())
                .hotelName(review.getHotel().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }

    public List<ReviewResponse> getReviewsByHotelId(Long hotelId) {
        hotelRepository.findById(hotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found"));

        return reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId)
                .stream()
                .map(review -> ReviewResponse.builder()
                        .userName(review.getUser().getName())
                        .hotelName(review.getHotel().getName())
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .createdAt(review.getCreatedAt())
                        .updatedAt(review.getUpdatedAt())
                        .build())
                .toList();
    }
}
