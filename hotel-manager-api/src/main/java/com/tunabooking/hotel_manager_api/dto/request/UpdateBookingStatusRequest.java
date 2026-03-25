package com.tunabooking.hotel_manager_api.dto.request;

import com.tunabooking.hotel_manager_api.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBookingStatusRequest {
    @NotNull(message = "Status cannot be null")
    private BookingStatus status;
}
