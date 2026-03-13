package com.tunabooking.hotel_manager_api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUserRequest {

    @Schema(description = "Name of the user", example = "Tuan Tran Updated")
    private String name;

    @Email(message = "Invalid email format")
    @Schema(description = "Email of the user", example = "tuan_updated@example.com")
    private String email;

    @Schema(description = "Password of the user", example = "newSecurePassword")
    private String password;
}
