package com.tunabooking.hotel_manager_api.controller.admin;

import com.tunabooking.hotel_manager_api.dto.request.RoomRequest;
import com.tunabooking.hotel_manager_api.dto.response.RoomResponse;
import com.tunabooking.hotel_manager_api.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/rooms")
@RequiredArgsConstructor
public class AdminRoomController {

    private final RoomService roomService;

    @Operation(summary = "Create a new room", description = "Add a new room to an existing hotel")
    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request) {
        RoomResponse response = roomService.createRoom(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
