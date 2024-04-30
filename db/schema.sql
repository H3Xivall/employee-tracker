-- Drops the database if it exists and creates a new database called employee_tracker_db
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE IF NOT EXISTS employee_tracker_db;

-- Use the employee_tracker_db database
USE employee_tracker_db;

-- Create the department table
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create roles table
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create employees table
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);