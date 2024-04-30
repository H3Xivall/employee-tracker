// Imports
require('dotenv').config();
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const fs = require('fs');
const path = require('path');
const faker = require('@faker-js/faker');

// Set up database connection using environment variables
const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true,
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error Connecting: ' + err.stack);
        return;
    }

    console.log('Connected to MySQL as id:'+ db.threadId);

    // Read and execute the SQL files
    const schemaSql = fs.readFileSync(path.join('db/schema.sql'), 'utf-8');
    db.query(schemaSql, (err, results) => {
        if (err) {
            console.error('Error executing schema.sql:'+ err.stack);
            return;
        }

        console.log('Schema.sql executed successfully');
    });
    const seedSql = fs.readFileSync(path.join('db/seed.sql'), 'utf-8');
    db.query(seedSql, (err, results) => {
        if (err) {
            console.error('Error executing seed.sql:' + err.stack);
            return;
        }

        console.log('Seed.sql executed successfully');
    });

    // Generate Employees
    // seedEmployees();

    // Start the application
    // start();
});

// Start the application function

function start() {
    inquirer
}

// Function to randomly generate employees
function seedEmployees() {
    const employees = [];
    for (let i = 0; i < 50; i++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const role_id = faker.datatype.number({ min: 1, max: 4 });
        const manager_id = i > 0 ? faker.datatype.number({ min: 1, max: 5 }) : null;

        employees.push([
            firstName,
            lastName,
            role_id,
            manager_id,
        ]);
    }

    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?';
    db.query(sql, [employees], (err, results) => {
        if (err) {
            console.error('Error seeding employees: ' + err.stack);
            return;
        }

        console.log('Employees seeded successfully');
    });
}