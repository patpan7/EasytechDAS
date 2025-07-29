package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their username.
     *
     * @param username the username to search for
     * @return an {@link Optional} of the user if found, otherwise {@link Optional#empty()}
     */
    Optional<User> findByUsername(String username);

    /**
     * Finds all users, sorted by ID.
     *
     * @param sort the sort order
     * @return a list of all users, sorted by ID
     */
    List<User> findAll(Sort sort);
}
