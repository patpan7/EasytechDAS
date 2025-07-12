-- This file will be executed automatically by Spring Boot to populate the database.

-- Insert sample users (password is 'password' for both, encrypted with BCrypt)
-- You should register these users via the frontend registration page for proper password hashing.
-- These are just for initial setup if needed.
INSERT INTO users (id, username, password, role) VALUES
(1, 'supervisor', '$2a$10$e.g.a.new.hash.for.password.here.ThisIsALongStringOfCharacters', 'ROLE_SUPERVISOR'),
(2, 'partner1', '$2a$10$e.g.a.new.hash.for.password.here.ThisIsALongStringOfCharacters', 'ROLE_PARTNER');

-- Insert sample customers for the users
-- Customer A is associated with supervisor (user_id 1)
-- Customer B is associated with partner1 (user_id 2)
INSERT INTO customers (id, name, status, eponimia, title, afm, profession, address, city, zip_code, doy, phone1, phone2, mobile, email, user_id) VALUES
(1, 'Customer A', 'Active', 'Επωνυμία Α', 'Τίτλος Α', '123456789', 'Επάγγελμα Α', 'Διεύθυνση Α', 'Πόλη Α', '12345', 'ΔΟΥ Α', '2101234567', '', '6901234567', 'customerA@example.com', 1),
(2, 'Customer B', 'Active', 'Επωνυμία Β', 'Τίτλος Β', '987654321', 'Επάγγελμα Β', 'Διεύθυνση Β', 'Πόλη Β', '54321', 'ΔΟΥ Β', '2107654321', '', '6987654321', 'customerB@example.com', 2);

-- Insert sample devices for the customers
INSERT INTO devices (id, serial_number, status, customer_id) VALUES
(1, 'DEV001', 'Active', 1),
(2, 'DEV002', 'Inactive', 2);