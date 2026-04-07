package com.tunabooking.hotel_manager_api.service;

import com.tunabooking.hotel_manager_api.dto.request.HotelRequest;
import com.tunabooking.hotel_manager_api.dto.response.HotelResponse;
import com.tunabooking.hotel_manager_api.entity.Hotel;
import com.tunabooking.hotel_manager_api.exception.HotelNotFoundException;
import com.tunabooking.hotel_manager_api.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.tunabooking.hotel_manager_api.specification.HotelSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    public List<HotelResponse> getAllHotels() {
        return hotelRepository.findAll().stream()
                .map(this::mapToHotelResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "hotels_search", key = "{#city, #minPrice, #maxPrice, #capacity, #page, #size}")
    public Page<HotelResponse> searchHotels(String city, BigDecimal minPrice, BigDecimal maxPrice, Integer capacity, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        Specification<Hotel> spec = Specification.where(HotelSpecification.hasCity(city))
                .and(HotelSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(HotelSpecification.hasRoomCapacity(capacity));

        Page<Hotel> hotelPage = hotelRepository.findAll(spec, pageable);

        return hotelPage.map(this::mapToHotelResponse);
    }

    public HotelResponse getHotelById(Long id) {
        Hotel hotel = getHotelEntityById(id);
        return mapToHotelResponse(hotel);
    }

    @Transactional
    @CacheEvict(value = "hotels_search", allEntries = true)
    public HotelResponse createHotel(HotelRequest request) {
        Hotel hotel = Hotel.builder()
                .name(request.getName())
                .city(request.getCity()) // Wait, lombok uses getCity() usually
                .description(request.getDescription())
                .rating(request.getRating())
                .build();

        Hotel savedHotel = hotelRepository.save(hotel);
        return mapToHotelResponse(savedHotel);
    }

    @Transactional
    @CacheEvict(value = "hotels_search", allEntries = true)
    public HotelResponse updateHotel(Long id, HotelRequest request) {
        Hotel hotel = getHotelEntityById(id);

        if (request.getName() != null)
            hotel.setName(request.getName());
        if (request.getCity() != null)
            hotel.setCity(request.getCity());
        if (request.getDescription() != null)
            hotel.setDescription(request.getDescription());
        if (request.getRating() != null)
            hotel.setRating(request.getRating());

        Hotel updatedHotel = hotelRepository.save(hotel);
        return mapToHotelResponse(updatedHotel);
    }

    @Transactional
    @CacheEvict(value = "hotels_search", allEntries = true)
    public void deleteHotel(Long id) {
        Hotel hotel = getHotelEntityById(id);
        hotelRepository.delete(hotel);
    }

    private Hotel getHotelEntityById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new HotelNotFoundException("Hotel not found with id: " + id));
    }

    private HotelResponse mapToHotelResponse(Hotel hotel) {
        return HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .city(hotel.getCity())
                .description(hotel.getDescription())
                .rating(hotel.getRating())
                .createdAt(hotel.getCreatedAt())
                .build();
    }
}
