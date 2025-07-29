package com.example.demo.repository;

import com.example.demo.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;

import java.util.List;

/**
 * Spring Data JPA repository for the {@link Customer} entity.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    /**
     * Finds all customers associated with a specific user, sorted by ID.
     *
     * @param userId the ID of the user
     * @param sort the sort order
     * @return a list of customers for the given user, sorted by ID
     */
    List<Customer> findByUserId(Long userId, Sort sort);

    /**
     * Finds all customers, sorted by ID.
     *
     * @param sort the sort order
     * @return a list of all customers, sorted by ID
     */
    List<Customer> findAll(Sort sort);
}
