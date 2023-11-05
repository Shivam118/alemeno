const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const { isLoggedIn } = require("./middleware");
const courseList = require("../db/courses.json");
const userList = require("../db/users.json");
const fs = require("fs");
const path = require("path");

// This Route is used to get all the courses based on the page and search query.
router.get("/all", async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status, search } = req.query; // Query Params passed in the URL

    var courses = Array.from(courseList); // Copying the courseList array to courses array

    if (status !== "") {
      // Filtering the courses based on the status
      courses = courseList.filter(
        (course) => course.enrollmentStatus === status
      );
    }

    if (search !== "") {
      // Filtering the courses based on the search query
      courses = courseList.filter(
        (course) =>
          course.name.toLowerCase().includes(search.toLowerCase()) ||
          course.instructor.toLowerCase().includes(search.toLowerCase()) ||
          course.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    //Slicing the array based on the pageNumber and pageSize
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + parseInt(pageSize);
    let paginatedCourses = courses.slice(startIndex, endIndex);

    return res.json({
      totalCourses: courses.length,
      totalPages: Math.ceil(courses.length / pageSize),
      currentPage: parseInt(page),
      courses: paginatedCourses,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// This Route is used to get the details of a particular course.
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Params passed in the URL

    // Finding the course with the given id
    const detailedCourse = courseList.find(
      (course) => course.id === parseInt(id)
    );
    return res.status(200).json({ data: detailedCourse });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// This Route is used to enroll a particular student in the course.
router.post("/getEnrolled", isLoggedIn, async (req, res) => {
  try {
    const { courseId, userEmail } = req.body; // Params passed in the Body of the URL

    if (!courseId || !userEmail) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    // Finding the user with the given email
    const user = userList.find((user) => user.email === userEmail);
    // Finding the course with the given id
    const course = courseList.find(
      (course) => course.id === parseInt(courseId)
    );

    // Checking if the user is already enrolled in the course
    const alreadyEnrolledCheck = user.coursesEnrolled.some(
      (course) => course.courseId === parseInt(courseId)
    );
    if (alreadyEnrolledCheck) {
      return res.status(400).json({ error: "Already enrolled" });
    }

    // Adding the student to the course using readFile and writeFile
    fs.readFile(
      path.join(__dirname, "..", "/db/courses.json"),
      "utf8",
      (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        const courses = JSON.parse(data);
        const courseIndex = courses.findIndex(
          (course) => course.id === parseInt(courseId)
        );
        courses[courseIndex].students.push({
          id: user.id,
          email: user.email,
          name: user.firstName + " " + user.lastName,
        });
        fs.writeFile(
          path.join(__dirname, "..", "/db/courses.json"),
          JSON.stringify(courses),
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
      }
    );
    fs.readFile(
      path.join(__dirname, "..", "/db/users.json"),
      "utf8",
      (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        const users = JSON.parse(data);
        const userIndex = users.findIndex((user) => user.email === userEmail);
        users[userIndex].coursesEnrolled.push({
          courseId: course.id,
          courseName: course.name,
          instructor: course.instructor,
          thumbnail: course.thumbnail,
          dueDate: course.dueDate,
          progress: 0,
        });
        fs.writeFile(
          path.join(__dirname, "..", "/db/users.json"),
          JSON.stringify(users),
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
      }
    );

    return res.status(200).json({ data: "Enrolled Successfully" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
