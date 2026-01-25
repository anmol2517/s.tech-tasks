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
  seatNumber INT
);

CREATE TABLE Payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  amountPaid DECIMAL(10,2),
  paymentStatus VARCHAR(100)
);
