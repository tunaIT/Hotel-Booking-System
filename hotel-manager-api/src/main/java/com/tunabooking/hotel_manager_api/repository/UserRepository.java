package com.tunabooking.hotel_manager_api.repository;

import com.tunabooking.hotel_manager_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
