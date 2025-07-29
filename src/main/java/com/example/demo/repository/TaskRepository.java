package com.example.demo.repository;

import com.example.demo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Sort;

import java.util.List;

/**
 * Spring Data JPA repository for the {@link Task} entity.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Finds all tasks created by a specific user, sorted by ID.
     *
     * @param createdById the ID of the user who created the tasks
     * @param sort the sort order
     * @return a list of tasks created by the user
     */
    List<Task> findByCreatedById(Long createdById, Sort sort);

    /**
     * Finds all tasks by status, sorted by ID.
     *
     * @param status the status of the tasks to find
     * @param sort the sort order
     * @return a list of tasks with the given status
     */
    List<Task> findByStatus(String status, Sort sort);

    /**
     * Finds all tasks, sorted by ID.
     *
     * @param sort the sort order
     * @return a list of all tasks, sorted by ID
     */
    List<Task> findAll(Sort sort);
}
