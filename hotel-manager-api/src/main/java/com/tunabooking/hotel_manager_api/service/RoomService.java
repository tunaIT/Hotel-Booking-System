package com.tunabooking.hotel_manager_api.service;

import com.tunabooking.hotel_manager_api.dto.request.RoomRequest;
import com.tunabooking.hotel_manager_api.dto.response.RoomResponse;
import com.tunabooking.hotel_manager_api.entity.Hotel;
import com.tunabooking.hotel_manager_api.entity.Room;
import com.tunabooking.hotel_manager_api.exception.HotelNotFoundException;
import com.tunabooking.hotel_manager_api.exception.RoomNotFoundException;
import com.tunabooking.hotel_manager_api.repository.HotelRepository;
import com.tunabooking.hotel_manager_api.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;

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
    @CacheEvict(value = "hotels_search", allEntries = true)
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

    @Transactional
    @CacheEvict(value = "hotels_search", allEntries = true)
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + id));
        
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found with id: " + request.getHotelId()));

        room.setHotel(hotel);
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setDescription(request.getDescription());

        Room updatedRoom = roomRepository.save(room);
        return mapToRoomResponse(updatedRoom);
    }

    @Transactional
    @CacheEvict(value = "hotels_search", allEntries = true)
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + id));
        roomRepository.delete(room);
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
