package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Spring Boot application.
 * This class initializes the Spring application context.
 */
@SpringBootApplication
public class DemoApplication {

    /**
     * The main method which serves as the entry point for the application.
     * @param args Command line arguments.
     */
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
