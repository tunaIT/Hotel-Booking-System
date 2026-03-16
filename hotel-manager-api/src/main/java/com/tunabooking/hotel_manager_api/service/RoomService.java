package com.tunabooking.hotel_manager_api.service;

import com.tunabooking.hotel_manager_api.dto.request.RoomRequest;
import com.tunabooking.hotel_manager_api.dto.response.RoomResponse;
import com.tunabooking.hotel_manager_api.entity.Hotel;
import com.tunabooking.hotel_manager_api.entity.Room;
import com.tunabooking.hotel_manager_api.exception.HotelNotFoundException;
import com.tunabooking.hotel_manager_api.repository.HotelRepository;
import com.tunabooking.hotel_manager_api.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    public List<RoomResponse> getRoomsByHotelId(Long hotelId) {
        // Check if hotel exists first
        if (!hotelRepository.existsById(hotelId)) {
            throw new HotelNotFoundException("Hotel not found with id: " + hotelId);
        }

        return roomRepository.findByHotelId(hotelId).stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found with id: " + request.getHotelId()));

        Room room = Room.builder()
                .hotel(hotel)
                .roomType(request.getRoomType())
                .price(request.getPrice())
                .capacity(request.getCapacity())
                .description(request.getDescription())
                .build();

        Room savedRoom = roomRepository.save(room);
        return mapToRoomResponse(savedRoom);
    }

    private RoomResponse mapToRoomResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .hotelId(room.getHotel().getId())
                .roomType(room.getRoomType())
                .price(room.getPrice())
                .capacity(room.getCapacity())
                .description(room.getDescription())
                .createdAt(room.getCreatedAt())
                .build();
    }
}
