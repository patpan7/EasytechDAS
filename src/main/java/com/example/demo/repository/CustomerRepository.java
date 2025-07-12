package com.example.demo.repository;

import com.example.demo.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the {@link Customer} entity.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    /**
     * Finds all customers associated with a specific user.
     *
     * @param userId the ID of the user
     * @return a list of customers for the given user
     */
    List<Customer> findByUserId(Long userId);
}
