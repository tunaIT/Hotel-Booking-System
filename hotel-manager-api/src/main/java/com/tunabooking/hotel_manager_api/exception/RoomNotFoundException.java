package com.tunabooking.hotel_manager_api.exception;

public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException(String message) {
        super(message);
    }
}
