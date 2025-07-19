package com.example.demo.controller;

import com.example.demo.dto.TaskCreateRequest;
import com.example.demo.dto.TaskDto;
import com.example.demo.dto.TaskUpdateRequest;
import com.example.demo.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Creates a new task (only for Partners).
     *
     * @param request the request containing task details
     * @return a {@link ResponseEntity} containing the created task DTO
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('PARTNER')")
    public ResponseEntity<TaskDto> createTask(@Valid @RequestBody TaskCreateRequest request) {
        TaskDto createdTask = taskService.createTask(request);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    /**
     * Gets a list of tasks.
     * Partners see their own tasks, Supervisors see all tasks.
     *
     * @return a {@link ResponseEntity} containing the list of {@link TaskDto}s
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'PARTNER')")
    public ResponseEntity<List<TaskDto>> getTasks() {
        return ResponseEntity.ok(taskService.getTasks());
    }

    /**
     * Updates the status of a task (only for Supervisors).
     *
     * @param taskId the ID of the task to update
     * @param request the request containing the new status
     * @return the updated task DTO
     */
    @PutMapping("/{taskId}/status")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<TaskDto> updateTaskStatus(@PathVariable Long taskId, @Valid @RequestBody TaskUpdateRequest request) {
        TaskDto updatedTask = taskService.updateTaskStatus(taskId, request);
        return ResponseEntity.ok(updatedTask);
    }
}
