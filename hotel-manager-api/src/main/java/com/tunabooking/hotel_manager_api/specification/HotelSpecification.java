package com.tunabooking.hotel_manager_api.specification;

import com.tunabooking.hotel_manager_api.entity.Hotel;
import com.tunabooking.hotel_manager_api.entity.Room;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class HotelSpecification {

    public static Specification<Hotel> hasCity(String city) {
        return (root, query, cb) -> {
            if (city == null || city.trim().isEmpty()) {
                // bo qua dieu kien nay
                return null;
            }
            return cb.equal(cb.lower(root.get("city")), city.toLowerCase());
        };
    }

    public static Specification<Hotel> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null || maxPrice == null) {
                return null;
            }

            // We need a distinct query since a hotel might have multiple rooms in the price
            // range
            query.distinct(true);

            Join<Hotel, Room> roomJoin = root.join("rooms");
            return cb.between(roomJoin.get("price"), minPrice, maxPrice);
        };
    }
    public static Specification<Hotel> hasRoomCapacity(Integer capacity) {
        return (root, query, cb) -> {
            if (capacity == null) {
                return null;
            }
            query.distinct(true);
            Join<Hotel, Room> roomJoin = root.join("rooms");
            return cb.greaterThanOrEqualTo(roomJoin.get("capacity"), capacity);
        };
    }
}
