package com.tunabooking.hotel_manager_api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Schema(example = "Tran Tuan", description = "User's full name")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(example = "tuan.tran@example.com", description = "User's email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(example = "Secret123!", description = "User's password")
    private String password;
}
