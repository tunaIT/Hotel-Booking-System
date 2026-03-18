package com.tunabooking.hotel_manager_api.service;

import com.tunabooking.hotel_manager_api.dto.request.BookingRequest;
import com.tunabooking.hotel_manager_api.dto.response.BookingResponse;
import com.tunabooking.hotel_manager_api.entity.Booking;
import com.tunabooking.hotel_manager_api.entity.BookingStatus;
import com.tunabooking.hotel_manager_api.entity.Room;
import com.tunabooking.hotel_manager_api.entity.User;
import com.tunabooking.hotel_manager_api.repository.BookingRepository;
import com.tunabooking.hotel_manager_api.repository.RoomRepository;
import com.tunabooking.hotel_manager_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        // 1. Validate dates
        if (request.getCheckOutDate().isBefore(request.getCheckInDate())
                || request.getCheckOutDate().isEqual(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        // 2. Get current authenticated user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        // 3. Get room
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + request.getRoomId()));

        // 4. Check availability
        boolean isOverlapping = bookingRepository.existsOverlappingBooking(
                request.getRoomId(),
                List.of(BookingStatus.CONFIRMED, BookingStatus.PENDING),
                request.getCheckInDate(),
                request.getCheckOutDate());

        if (isOverlapping) {
            throw new RuntimeException("Room is not available for the selected dates");
        }

        // 5. Calculate total price
        long daysBetween = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal totalPrice = room.getPrice().multiply(BigDecimal.valueOf(daysBetween));

        // 6. Create booking
        Booking booking = Booking.builder()
                .user(currentUser)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .status(BookingStatus.PENDING)
                .totalPrice(totalPrice)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        return mapToResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        return bookingRepository.findByUserId(currentUser.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to delete this booking");
        }

        bookingRepository.delete(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .roomId(booking.getRoom().getId())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .build();
    }
}
