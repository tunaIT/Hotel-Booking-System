package com.tunabooking.hotel_manager_api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    @Schema(description = "Unique identifier of the user", example = "1")
    private Long id;

    @Schema(description = "User's full name", example = "Tuan Tran")
    private String name;

    @Schema(description = "User's email address", example = "tuan.tran@example.com")
    private String email;

    @Schema(description = "User's role", example = "USER")
    private com.tunabooking.hotel_manager_api.entity.Role role;

    @Schema(description = "Timestamp when the user was created", example = "2026-03-15T10:00:00")
    private LocalDateTime createdAt;
}
