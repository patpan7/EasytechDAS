package com.example.demo.service;

import com.example.demo.dto.TaskCreateRequest;
import com.example.demo.dto.TaskDto;
import com.example.demo.dto.TaskUpdateRequest;
import com.example.demo.model.Task;
import com.example.demo.model.User;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    /**
     * Creates a new task.
     *
     * @param request the request containing task details
     * @return the created task DTO
     */
    public TaskDto createTask(TaskCreateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!currentUser.getRole().startsWith("ROLE_PARTNER")) {
            throw new AccessDeniedException("Only partners can create tasks.");
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus("PENDING"); // Default status
        task.setCreatedBy(currentUser);

        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    /**
     * Gets a list of tasks based on the current user's role.
     *
     * @return a list of {@link TaskDto}s
     */
    public List<TaskDto> getTasks() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Set<Task> uniqueTasks = new LinkedHashSet<>();
        if ("ROLE_SUPERVISOR".equals(currentUser.getRole())) {
            uniqueTasks.addAll(taskRepository.findAll(Sort.by(Sort.Direction.ASC, "id")));
        } else if (currentUser.getRole().startsWith("ROLE_PARTNER")) {
            uniqueTasks.addAll(taskRepository.findByCreatedById(currentUser.getId(), Sort.by(Sort.Direction.ASC, "id")));
        } else {
            throw new AccessDeniedException("Access denied");
        }

        return uniqueTasks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Updates the status of a task.
     *
     * @param taskId the ID of the task to update
     * @param request the request containing the new status
     * @return the updated task DTO
     */
    public TaskDto updateTaskStatus(Long taskId, TaskUpdateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        // Only supervisor can update task status
        if (!"ROLE_SUPERVISOR".equals(currentUser.getRole())) {
            throw new AccessDeniedException("Only supervisors can update task status.");
        }

        task.setStatus(request.getStatus());
        if ("COMPLETED".equals(request.getStatus())) {
            task.setCompletedBy(currentUser);
        }

        Task updatedTask = taskRepository.save(task);
        return convertToDto(updatedTask);
    }

    private TaskDto convertToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        dto.setCreatedById(task.getCreatedBy().getId());
        dto.setCreatedByUsername(task.getCreatedBy().getUsername());
        if (task.getCompletedBy() != null) {
            dto.setCompletedById(task.getCompletedBy().getId());
            dto.setCompletedByUsername(task.getCompletedBy().getUsername());
        }
        return dto;
    }
}
