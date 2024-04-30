// Imports
require('dotenv').config();
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const fs = require('fs');
const path = require('path');
const faker = require('@faker-js/faker');
const { isPromise } = require('util/types');
const { parseArgs } = require('util');

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

    // Start the application
    start();
});

// Start the application function

async function start() {
    try {
        console.log('Connected to MySQL as id:'+ db.threadId);
        await initDB();
        console.log('                    --                    ');
        await welcome();

    } catch (err) {
        console.error(err.stack);
        return;
    }

}

// Function to randomly generate employees
async function seedEmployees() {
    try {
        const employee = [];
        for (let i = 0; i < 50; i++) {
            // const rando = faker.fakerEN.datatype.boolean();
            const gender = faker.fakerEN.person.sexType();
            const first_name = faker.fakerEN.person.firstName(gender);
            const last_name = faker.fakerEN.person.lastName(gender);
            const role_id = faker.fakerEN.number.int({ min: 1, max: 4 });
            const manager_id = i > 5 ? faker.fakerEN.number.int({ min: 1, max: 5 }) : null;
    
            employee.push([
                first_name,
                last_name,
                role_id,
                manager_id,
            ]);
        }
        // console.log(employee);
        const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ? ';
        const results = await db.promise().query(sql, [employee]);
        console.log(`${results[0].affectedRows} employee records inserted successfully!`);
    } catch(err) {
        console.error('Error in seed employees: ' + err.stack);
        return;
    }
}

async function initDB() {
        try {
            const schemaSql = fs.readFileSync(path.join('db/schema.sql'), 'utf8');
            await db.promise().query(schemaSql);
            const seedSql = fs.readFileSync(path.join('db/seed.sql'), 'utf8');
            await db.promise().query(seedSql);
            console.log('Database seeded successfully');
            await seedEmployees();
        } catch(err) {
            console.error(err.stack);
            return;
        }
}

// Welcome text function
async function welcome() {
    try {
        console.log('##########################################');
        console.log('##########################################');
        console.log('Welcome to the Employee Management System!');
        console.log('##########################################');
        console.log('##########################################');
        console.log('                    --                    ');    
    } catch(err) {
        console.error(err.stack);
        return;
    }
}