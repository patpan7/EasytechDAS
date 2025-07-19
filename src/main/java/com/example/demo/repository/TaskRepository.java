package com.example.demo.repository;

import com.example.demo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the {@link Task} entity.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Finds all tasks created by a specific user.
     *
     * @param createdById the ID of the user who created the tasks
     * @return a list of tasks created by the user
     */
    List<Task> findByCreatedById(Long createdById);

    /**
     * Finds all tasks by status.
     *
     * @param status the status of the tasks to find
     * @return a list of tasks with the given status
     */
    List<Task> findByStatus(String status);
}
