CREATE DATABASE bus_booking_system;
USE bus_booking_system;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE Buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  busNumber VARCHAR(100),
  totalSeats INT,
  availableSeats INT
);

CREATE TABLE Bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  bus_id INT,
  booking_date DATE
);

CREATE TABLE Payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amountPaid DECIMAL(10,2),
  paymentStatus VARCHAR(100)
);


INSERT INTO Users (name, email) VALUES
('Alice', 'alice@gmail.com'),
('Bob', 'bob@gmail.com');

INSERT INTO Buses (busNumber, totalSeats, availableSeats) VALUES
('MH12-101', 40, 15),
('MH12-102', 50, 5),
('MH12-103', 45, 20);

SELECT * FROM Users;

SELECT * FROM Buses WHERE availableSeats > 10;
