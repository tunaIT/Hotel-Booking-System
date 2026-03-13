package com.tunabooking.hotel_manager_api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateUserRequest {

    @NotBlank(message = "Name is required")
    @Schema(description = "Name of the user", example = "Tuan Tran")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "Email of the user", example = "tuan@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(description = "Password of the user", example = "mySecurePassword")
    private String password;
}
