CREATE DATABASE student_db;
USE student_db;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  age INT
);

INSERT INTO students (name, email, age)
VALUES ('MS Dhoni', 'dhoni@example.com', 42);

INSERT INTO students (name, email, age)
VALUES ('Virat Kohli', 'virat.kohli@example.com', 35);

UPDATE students
SET name = 'Captain Cool', email = 'captaincool@example.com'
WHERE id = 1;

DELETE FROM students WHERE id = 2;

SELECT * FROM students;
