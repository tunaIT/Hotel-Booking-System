package com.tunabooking.hotel_manager_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double rating;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Room> rooms = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Helper method to maintain bi-directional relationship
    public void addRoom(Room room) {
        rooms.add(room);
        room.setHotel(this);
    }

    public void removeRoom(Room room) {
        rooms.remove(room);
        room.setHotel(null);
    }
}
