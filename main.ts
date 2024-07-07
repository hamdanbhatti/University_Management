#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";

// Global arrays to store all entities
const students: Student[] = [];
const instructors: Instructor[] = [];
const departments: Department[] = [];

//*             Classes

//todo    Person Class
class Person {
     name: string;
     age: number;

     constructor(name: string, age: number) {
          this.name = name;
          this.age = age;
     }

     getName() {
          return this.name;
     }
}

//todo    Student Class
class Student extends Person {
     rollNumber: number = 0;
     courses: Course[] = [];

     constructor(name: string, age: number) {
          super(name, age);
     }

     registerForCourse(course: Course) {
          this.courses.push(course);
          course.addStudent(this);
     }
}
//todo    Instructor Class
class Instructor extends Person {
     private salary: number = 5000;
     courses: Course[] = [];

     constructor(name: string, age: number) {
          super(name, age);
     }

     assignCourse(course: Course) {
          this.courses.push(course);
          course.setInstructor(this);
     }

     setSalary(salary: number) {
          this.salary = salary;
     }
}

//todo    Course Class
class Course {
     id: string;
     name: string;
     students: Student[] = [];
     instructors: Instructor[] = [];

     constructor(id: string, name: string) {
          this.id = id;
          this.name = name;
     }

     addStudent(student: Student) {
          this.students.push(student);
          student.rollNumber = this.students.length;
     }

     setInstructor(instructor: Instructor) {
          this.instructors.push(instructor);
     }
}

//todo    Department Class
class Department {
     name: string;
     courses: Course[] = [];

     constructor(name: string) {
          this.name = name;
     }

     addCourse(course: Course) {
          this.courses.push(course);
     }
}

//*             Functions

//todo    Add Department Function

async function addDepartment() {
     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(7)));
     console.log(chalk.rgb(227, 202, 64)("\n\t\tDEPARTMENT SECTION\n"));
     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(7)));

     const { name } = await inquirer.prompt([
          {
               type: "input",
               name: "name",
               message: chalk.rgb(97, 156, 78)("Enter the department name:"),
               validate: (value) => {
                    if (value.length < 3) {
                         return chalk.red("Department name should be at least 3 characters long.");
                    }
                    return true;
               },
          },
     ]);

     const department = new Department(name);
     departments.push(department);

     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(8)));
     console.log(`\n\t${chalk.rgb(230, 106, 48)(`Added department:`)} ${chalk.rgb(230, 151, 73)(`"${department.name}"`)}\n`);
     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(8)));
}

//todo    Add Course Function
async function addCourse() {
     if (departments.length === 0) {
          console.log(chalk.red("You need to add a department first before adding a course."));
          return;
     }

     const { id, name, departmentName } = await inquirer.prompt([
          {
               type: "input",
               name: "id",
               message: chalk.rgb(97, 156, 78)("Enter the course ID:"),
          },
          {
               type: "input",
               name: "name",
               message: chalk.rgb(97, 156, 78)("Enter the course name:"),
          },
          {
               type: "list",
               name: "departmentName",
               message: chalk.rgb(97, 156, 78)("Select the department:"),
               choices: departments.map((dept) => dept.name),
          },
     ]);

     const course = new Course(id, name);
     const department = departments.find((dept) => dept.name === departmentName);
     if (department) {
          department.addCourse(course);
          console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(8)));
          console.log(
               chalk.rgb(
                    255,
                    113,
                    84,
               )(
                    `\n\t\tAdded course: ${`${chalk.rgb(230, 151, 73)(course.name)}`}\n\t\tID: ${chalk.rgb(
                         230,
                         151,
                         73,
                    )(course.id)}\n\t\tTo Department: ${chalk.rgb(230, 151, 73)(department.name)}\n`,
               ),
          );
          console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(8)));
     } else {
          console.log(chalk.red("Department not found"));
     }
}

//todo    Add Instructor Function
async function addInstructor() {
     const { name, age } = await inquirer.prompt([
          {
               type: "input",
               name: "name",
               message: chalk.rgb(97, 156, 78)("Enter the instructor name:"),
          },
          {
               type: "number",
               name: "age",
               message: chalk.rgb(97, 156, 78)("Enter the instructor age:"),
          },
     ]);

     const instructor = new Instructor(name, age);
     instructors.push(instructor);
     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(8)));
     console.log(
          chalk.rgb(
               255,
               166,
               13,
          )(`\n\t\tAdded instructor: ${chalk.rgb(179, 32, 71)(instructor.name)}\n\t\tAge: ${chalk.rgb(179, 32, 71)(instructor.age)}\n`),
     );
     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(8)));
}

//todo    Add Student Function
async function addStudent() {
     const { name, age } = await inquirer.prompt([
          {
               type: "input",
               name: "name",
               message: chalk.rgb(97, 156, 78)("Enter the student name:"),
          },
          {
               type: "number",
               name: "age",
               message: chalk.rgb(97, 156, 78)("Enter the student age:"),
          },
     ]);

     const student = new Student(name, age);
     students.push(student);
     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(8)));
     console.log(
          chalk.rgb(255, 166, 13)(`\n\t\tAdded student: ${chalk.rgb(179, 32, 71)(student.name)}\n\t\tAge: ${chalk.rgb(179, 32, 71)(student.age)}\n`),
     );
     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(8)));
}

//todo    Remove Student Function
async function removeStudent() {
     if (students.length === 0) {
          console.log(chalk.redBright("\n--->\tNo students to remove\n"));
          return;
     }

     const studentNames = students.map((student) => student.name);

     const { studentName } = await inquirer.prompt([
          {
               type: "list",
               name: "studentName",
               message: chalk.rgb(97, 156, 78)("Select the student to remove:"),
               choices: studentNames,
          },
     ]);

     const student = students.find((student) => student.name === studentName);

     if (student) {
          students.splice(students.indexOf(student), 1);
          console.log(chalk.redBright(`\n\t\tRemoved student: ${student.name}\n`));
     } else {
          console.log("Student not found");
     }
}

//todo    View All Student Function
async function viewAllStudents() {
     if (students.length === 0) {
          console.log(chalk.red("No students found"));
          return;
     }
     console.log(chalk.yellowBright("All Students:"));
     students.forEach((student) => {
          console.log(chalk.rgb(183, 235, 203)(`\n\t\t${student.name} - Age: ${student.age}\n`));
     });
}

//todo    View All Courses Function
async function viewAllCourses() {
     if (departments.length === 0) {
          console.log(chalk.red("\n\t\tNo courses found\n"));
          return;
     }
     console.log(chalk.yellowBright("\n\t\tAll Courses:\n"));
     departments.forEach((dept) => {
          dept.courses.forEach((course) => {
               console.log(chalk.rgb(162, 90, 224)(`\n\t${course.name} (${course.id}) - Department: ${dept.name}\n`));
          });
     });
}

//todo    View All Instructors Function
async function viewAllInstructors() {
     if (instructors.length === 0) {
          console.log(chalk.red("No instructors found"));
          return;
     }
     console.log(chalk.yellowBright("\n\t\tAll Instructors:\n"));
     instructors.forEach((instructor) => {
          console.log(chalk.rgb(162, 90, 224)(`\n\t\t${instructor.name} - Age: ${instructor.age}\n`));
     });
}

//todo    Register Student for Course Function
async function registerStudentForCourse() {
     if (students.length === 0) {
          console.log(chalk.red("\n\t\tNo students found\n"));
          return;
     }
     if (departments.length === 0) {
          console.log(chalk.red("\n\t\tNo courses found\n"));
          return;
     }
     const studentChoices = students.map((student) => ({
          name: chalk.greenBright(`${student.name} (${student.age})`),
          value: student,
     }));

     const courseChoices = departments.flatMap((dept) =>
          dept.courses.map((course) => ({
               name: chalk.rgb(171, 230, 90)(`\n\t\t${course.name} (${course.id}) - ${dept.name}\n`),
               value: course,
          })),
     );

     const { selectedStudents, selectedCourses } = await inquirer.prompt([
          {
               type: "checkbox",
               name: "selectedStudents",
               message: chalk.rgb(97, 156, 78)("Select students to register:"),
               choices: studentChoices,
          },
          {
               type: "checkbox",
               name: "selectedCourses",
               message: chalk.rgb(97, 156, 78)("Select courses to register for:"),
               choices: courseChoices,
          },
     ]);

     for (const student of selectedStudents) {
          for (const course of selectedCourses) {
               student.registerForCourse(course);
               console.log(chalk.rgb(94, 180, 230)(`\n\t\tRegistered ${student.name} for ${course.name}\n`));
          }
     }
}

//todo    Assign Instructor for Course Function
async function assignInstructorToCourse() {
     if (instructors.length === 0) {
          console.log(chalk.red("\n\t\tNo instructors found\n"));
          return;
     }
     if (departments.length === 0) {
          console.log(chalk.red("\n\t\tNo courses found\n"));
          return;
     }
     const instructorChoices = instructors.map((instructor) => ({
          name: `${instructor.name} (${instructor.age})`,
          value: instructor,
     }));

     const courseChoices = departments.flatMap((dept) =>
          dept.courses.map((course) => ({
               name: chalk.greenBright(`${course.name} (${course.id}) - ${dept.name}`),
               value: course,
               hint: chalk.rgb(94, 180, 230)(`Instructors assigned: ${course.instructors.length}`),
          })),
     );

     const { selectedInstructors, selectedCourses } = await inquirer.prompt([
          {
               type: "checkbox",
               name: "selectedInstructors",
               message: chalk.rgb(97, 156, 78)("Select instructors to assign:"),
               choices: instructorChoices,
          },
          {
               type: "checkbox",
               name: "selectedCourses",
               message: chalk.rgb(97, 156, 78)("Select courses to assign instructors to:"),
               choices: courseChoices,
          },
     ]);

     for (const instructor of selectedInstructors) {
          for (const course of selectedCourses) {
               instructor.assignCourse(course);
               console.log(chalk.rgb(94, 180, 230)(`\n\t\t* Assigned ${instructor.name} to ${course.name}\n`));
          }
     }
}

//todo      View Departments and Courses Function
async function viewDepartmentsAndCourses() {
     console.log(chalk.rgb(94, 180, 230)("\n\t\tDepartments and their Courses:"));
     if (departments.length === 0) {
          console.log(chalk.red("No departments found"));
          return;
     }
     if (departments[0].courses.length === 0) {
          console.log(chalk.red("No courses found"));
          return;
     }
     departments.forEach((dept) => {
          console.log(chalk.bold.yellow(`\n\t\tDepartment: ${dept.name}`));
          if (dept.courses.length === 0) {
               console.log("\t\t  No courses available");
          } else {
               dept.courses.forEach((course) => {
                    console.log(chalk.greenBright(`\n\t\tCourse  - ${course.name} (${course.id})`));
               });
          }
          console.log();
     });
}

// Helper function to print student courses and instructors
// todo: Refactor this function
function printStudentCoursesAndInstructors(student: Student) {
     console.log(chalk.bold.greenBright(`\n\t\tStudent: ${student.name} (${student.age})`));
     if (student.courses.length === 0) {
          console.log(chalk.redBright("\t\t  No courses registered"));
     } else {
          student.courses.forEach((course) => {
               console.log(chalk.greenBright(`\n\t\tCourse  - ${course.name} (${course.id})\n`));
               if (course.instructors.length === 0) {
                    console.log(chalk.redBright("\n\tNo instructors assigned"));
               } else {
                    console.log(chalk.yellowBright("\n\t\tInstructors:"));
                    course.instructors.forEach((instructor) => {
                         console.log(chalk.greenBright(`\n\t\tInstructor --> ${instructor.name} (${instructor.age})`));
                    });
               }
          });
     }
     console.log();
}

//todo      View Students, Courses, and Instructors Function
async function viewStudentsCoursesAndInstructors() {
     console.log(chalk.yellowBright("\n\t\tStudents, their Courses, and Instructors:"));
     if (students.length === 0) {
          console.log(chalk.red("\t\tNo students found"));
          return;
     }

     // Iterate over each student and print their courses and instructors
     students.forEach(printStudentCoursesAndInstructors);
}

//todo    Main Function
async function main() {
     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(10)));

     console.log(chalk.bold.rgb(79, 201, 101)("\n\t\tWelcome to the University Management!\n"));

     console.log(chalk.rgb(227, 202, 64)("\t" + "=====".repeat(10)));

     const choices = [
          "Add Department",
          "Add Course",
          "Add Instructor",
          "Add Student",
          "Remove Student",
          "View All Students",
          "View All Courses",
          "View All Instructors",
          "View Departments and their Courses",
          "View Students, Courses, and Instructors",
          "Register Student for Course",
          "Assign Instructor to Course",
          "Exit",
     ];

     while (true) {
          const { action } = await inquirer.prompt([
               {
                    type: "list",
                    name: "action",
                    message: chalk.rgb(97, 156, 78)("What would you like to do?"),
                    choices,
               },
          ]);

          switch (action) {
               case "Add Department":
                    await addDepartment();
                    break;
               case "Add Course":
                    await addCourse();
                    break;
               case "Add Instructor":
                    await addInstructor();
                    break;
               case "Add Student":
                    await addStudent();
                    break;
               case "Remove Student":
                    await removeStudent();
                    break;
               case "View All Students":
                    await viewAllStudents();
                    break;
               case "View All Courses":
                    await viewAllCourses();
                    break;
               case "View All Instructors":
                    await viewAllInstructors();
                    break;
               case "View Departments and their Courses":
                    await viewDepartmentsAndCourses();
                    break;
               case "View Students, Courses, and Instructors":
                    await viewStudentsCoursesAndInstructors();
                    break;
               case "Register Student for Course":
                    await registerStudentForCourse();
                    break;
               case "Assign Instructor to Course":
                    await assignInstructorToCourse();
                    break;
               case "Exit":
                    console.log(chalk.rgb(81, 234, 240)("\t\tExiting..."));

                    setTimeout(() => {
                         console.log(chalk.rgb(163, 108, 245)("\n\tThanks for using the University Management!"));
                         console.log(
                              chalk.rgb(219, 177, 99)(`\n\tThis Program was created by ${chalk.rgb(204, 136, 53)("Muhammad Hamdan Bhatti")}.\n`),
                         );
                    }, 2000);

                    return;
               default:
                    console.log("Invalid choice");
          }
     }
}

main();
