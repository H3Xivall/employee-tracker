-- Building the department table
INSERT INTO department (name) VALUES ('Pit Crew'), ('Quarry Crew'), ('Heavy Equipment'), ('Food Service');

-- Seeds for role table
INSERT INTO role (title, salary, department_id) VALUES ('The Shoveler', 3000, 1), ('The Dumper', 4000, 2), ('The Hauler', 5000, 3), ('The Talk and Pointer', 10000, 4);