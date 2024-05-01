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
        await mainMenu();

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
            const department_id = faker.fakerEN.number.int({ min: 1, max: 4});
            const role_id = faker.fakerEN.number.int({ min: 1, max: 4 });
            const manager_id = i > 5 ? faker.fakerEN.number.int({ min: 1, max: 6 }) : null;
    
            employee.push([
                first_name,
                last_name,
                department_id,
                role_id,
                manager_id,
            ]);
        }
        // console.log(employee);
        const sql = 'INSERT INTO employee (first_name, last_name, department_id, role_id, manager_id) VALUES ? ';
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

// Main menu function
async function mainMenu() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'View All Employees By Department',
                    'View All Employees By Manager',
                    'Add Employee',
                    'Remove Employee',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'View All Roles',
                    'Add Role',
                    'Remove Role',
                    'View All Departments',
                    'Add Department',
                    'Remove Department',
                    'Exit'
                ]
            }
        ]);
        switch (answers.action) {
            case 'View All Employees':
                await viewAllEmployees();
                break;
            case 'View All Employees By Department':
                await viewAllEmployeesByDepartment();
                break;
            case 'View All Employees By Manager':
                await viewAllEmployeesByManager();
                break;
            case 'Add Employee':
                await addEmployee();
                break;
            case 'Remove Employee':
                await removeEmployee();
                break;
            case 'Update Employee Role':
                await updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                await updateEmployeeManager();
                break;
            case 'View All Roles':
                await viewAllRoles();
                break;
            case 'Add Role':
                await addRole();
                break;
            case 'Remove Role':
                await removeRole();
                break;
            case 'View All Departments':
                await viewAllDepartments();
                break;
            case 'Add Department':
                await addDepartment();
                break;
            case 'Remove Department':
                await removeDepartment();
                break;
            case 'Exit':
                await exit();
                break;
            default:
                console.error(`Error in main menu: ${err.stack}`);
                return;
        }
    } catch(err) {
        console.error(`Error in main menu: ${err.stack}`);
        return;
    }
}

// View all employees function
async function viewAllEmployees() {
    try {
        const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON employee.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.id ASC';
        const results = await db.promise().query(sql);
        console.table(results[0]);
        await mainMenu();
    } catch(err) {
        console.error(`Error in view all employees: ${err.stack}`);
        return;
    }
}

// View all employees by department function
async function viewAllEmployeesByDepartment() {
    try {
        const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON employee.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY department.name ASC';
        const results = await db.promise().query(sql);
        console.table(results[0]);
        await mainMenu();
    } catch(err) {
        console.error(`Error in view all employees by department: ${err.stack}`);
        return;
    }
}

// View all employees by manager function
async function viewAllEmployeesByManager() {
    try {
        const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON employee.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.manager_id ASC';
        const results = await db.promise().query(sql);
        console.table(results[0]);
        await mainMenu();
    } catch(err) {
        console.error(`Error in view all employees by manager: ${err.stack}`);
        return;
    }
}

// Add employee function
async function addEmployee() {
    try {
        const roles = await db.promise().query('SELECT id, title FROM role');
        const employees = await db.promise().query('SELECT id, first_name, last_name FROM employee');
        const departments = await db.promise().query('SELECT id, name FROM department');
        const departmentChoices = departments[0].map(({ id, name }) => ({ name: name, value: id }));
        const roleChoices = roles[0].map(({ id, title }) => ({ name: title, value: id }));
        const managerChoices = employees[0].map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
        managerChoices.unshift({ name: 'None', value: null });

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter employee first name:'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter employee last name:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select employee department:',
                choices: departmentChoices
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select employee role:',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select employee manager:',
                choices: managerChoices
            }
        ]);

        const sql = 'INSERT INTO employee (first_name, last_name, department_id, role_id, manager_id) VALUES (?, ?, ?, ?, ?)';
        const params = [answers.first_name, answers.last_name, answers.department_id, answers.role_id, answers.manager_id];
        const result = await db.promise().query(sql, params);
        console.log(`Employee ${answers.first_name} ${answers.last_name} added successfully!`);
        await mainMenu();
    } catch(err) {
        console.error(`Error in add employee: ${err.stack}`);
        return;
    }
}

// Remove employee function
async function removeEmployee() {
    try {
        const employees = await db.promise().query('SELECT id, first_name, last_name FROM employee');
        const employeeChoices = employees[0].map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select employee to remove:',
                choices: employeeChoices
            }
        ]);

        const sql = 'DELETE FROM employee WHERE id = ?';
        const result = await db.promise().query(sql, [answers.id]);
        console.log('Employee removed successfully!');
        await mainMenu();
    } catch(err) {
        console.error(`Error in remove employee: ${err.stack}`);
        return;
    }
}

// Update employee role function
async function updateEmployeeRole() {
    try {
        const employees = await db.promise().query('SELECT id, first_name, last_name FROM employee');
        const employeeChoices = employees[0].map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
        const roles = await db.promise().query('SELECT id, title FROM role');
        const roleChoices = roles[0].map(({ id, title }) => ({ name: title, value: id }));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select employee to update:',
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select new role:',
                choices: roleChoices
            }
        ]);

        const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
        const params = [answers.role_id, answers.id];
        const result = await db.promise().query(sql, params);
        console.log('Employee role updated successfully!');
        await mainMenu();
    } catch(err) {
        console.error(`Error in update employee role: ${err.stack}`);
        return;
    }
}

// Update employee manager function
async function updateEmployeeManager() {
    try {
        const employees = await db.promise().query('SELECT id, first_name, last_name FROM employee');
        const employeeChoices = employees[0].map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select employee to update:',
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select new manager:',
                choices: employeeChoices
            }
        ]);

        const sql = 'UPDATE employee SET manager_id = ? WHERE id = ?';
        const params = [answers.manager_id, answers.id];
        const result = await db.promise().query(sql, params);
        console.log('Employee manager updated successfully!');
        await mainMenu();
    } catch(err) {
        console.error(`Error in update employee manager: ${err.stack}`);
        return;
    }
}

// View all roles function
async function viewAllRoles() {
    try {
        const sql = 'SELECT role.id, role.title, role.salary FROM role ORDER BY role.id ASC';
        const results = await db.promise().query(sql);
        console.table(results[0]);
        await mainMenu();
    } catch(err) {
        console.error(`Error in view all roles: ${err.stack}`);
        return;
    }
}

// Add role function
async function addRole() {
    try {
        const departments = await db.promise().query('SELECT id, name FROM department');
        

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter role title:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter role salary:'
            }
        ]);

        const sql = 'INSERT INTO role (title, salary) VALUES (?, ?)';
        const params = [answers.title, answers.salary];
        const result = await db.promise().query(sql, params);
        console.log(`Role ${answers.title} added successfully!`);
        await mainMenu();
    } catch(err) {
        console.error(`Error in add role: ${err.stack}`);
        return;
    }
}

// Remove role function
async function removeRole() {
    try {
        const roles = await db.promise().query('SELECT id, title FROM role');
        const roleChoices = roles[0].map(({ id, title }) => ({ name: title, value: id }));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select role to remove:',
                choices: roleChoices
            }
        ]);

        const sql = 'DELETE FROM role WHERE id = ?';
        const result = await db.promise().query(sql, [answers.id]);
        console.log('Role removed successfully!');
        await mainMenu();
    } catch(err) {
        console.error(`Error in remove role: ${err.stack}`);
        return;
    }
}

// View all departments function
async function viewAllDepartments() {
    try {
        const sql = 'SELECT id, name FROM department';
        const results = await db.promise().query(sql);
        console.table(results[0]);
        await mainMenu();
    } catch(err) {
        console.error(`Error in view all departments: ${err.stack}`);
        return;
    }
}

// Add department function
async function addDepartment() {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter department name:'
            }
        ]);

        const sql = 'INSERT INTO department (name) VALUES (?)';
        const params = [answers.name];
        const result = await db.promise().query(sql, params);
        console.log(`Department ${answers.name} added successfully!`);
        await mainMenu();
    } catch(err) {
        console.error(`Error in add department: ${err.stack}`);
        return;
    }
}

// Remove department function
async function removeDepartment() {
    try {
        const departments = await db.promise().query('SELECT id, name FROM department');
        const departmentChoices = departments[0].map(({ id, name }) => ({ name: name, value: id }));

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select department to remove:',
                choices: departmentChoices
            }
        ]);

        const sql = 'DELETE FROM department WHERE id = ?';
        const result = await db.promise().query(sql, [answers.id]);
        console.log('Department removed successfully!');
        await mainMenu();
    } catch(err) {
        console.error(`Error in remove department: ${err.stack}`);
        return;
    }
}

// Exit function
async function exit() {
    console.log('Goodbye!');
    process.exit();
}