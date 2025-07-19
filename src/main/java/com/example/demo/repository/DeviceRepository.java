package com.example.demo.repository;

import com.example.demo.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the {@link Device} entity.
 */
@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {

    /**
     * Finds all devices associated with a specific user (partner or supervisor).
     *
     * @param userId the ID of the user
     * @return a list of devices for the given user
     */
    List<Device> findByCustomerUserId(Long userId);

    /**
     * Finds all devices directly assigned to a specific user (partner).
     *
     * @param userId the ID of the user
     * @return a list of devices for the given user
     */
    List<Device> findByUserId(Long userId);
}
