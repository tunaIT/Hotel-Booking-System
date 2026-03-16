package com.tunabooking.hotel_manager_api.exception;

public class HotelNotFoundException extends RuntimeException {
    public HotelNotFoundException(String message) {
        super(message);
    }
}
