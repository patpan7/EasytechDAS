package com.example.demo.repository;

import com.example.demo.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;

import java.util.List;

/**
 * Spring Data JPA repository for the {@link Device} entity.
 */
@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {

    /**
     * Finds all devices associated with a specific user (partner or supervisor), sorted by ID.
     *
     * @param userId the ID of the user
     * @param sort the sort order
     * @return a list of devices for the given user
     */
    List<Device> findByCustomerUserId(Long userId, Sort sort);

    /**
     * Finds all devices directly assigned to a specific user (partner), sorted by ID.
     *
     * @param userId the ID of the user
     * @param sort the sort order
     * @return a list of devices for the given user
     */
    List<Device> findByUserId(Long userId, Sort sort);

    /**
     * Finds all devices associated with a specific customer, sorted by ID.
     *
     * @param customerId the ID of the customer
     * @param sort the sort order
     * @return a list of devices for the given customer
     */
    List<Device> findByCustomerId(Long customerId, Sort sort);

    /**
     * Finds all devices, sorted by ID.
     *
     * @param sort the sort order
     * @return a list of all devices, sorted by ID
     */
    List<Device> findAll(Sort sort);
}
