CREATE DATABASE bus_booking_system;
USE bus_booking_system;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE Bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  bus_id INT,
  booking_date DATE,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);
