const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const { isLoggedIn } = require("./middleware");
const courseList = require("../db/courses.json");
const userList = require("../db/users.json");
const fs = require("fs");
const path = require("path");

router.get("/all", async (req, res) => {
  try {
    return res.status(200).json({ data: courseList });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const detailedCourse = courseList.find(
      (course) => course.id === parseInt(id)
    );
    return res.status(200).json({ data: detailedCourse });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/getEnrolled", isLoggedIn, async (req, res) => {
  try {
    const { courseId, userEmail } = req.body;
    if (!courseId || !userEmail) {
      return res.status(400).json({ error: "Please enter all fields" });
    }
    const user = userList.find((user) => user.email === userEmail);
    const course = courseList.find(
      (course) => course.id === parseInt(courseId)
    );

    const alreadyEnrolledCheck = user.coursesEnrolled.some(
      (course) => course.courseId === parseInt(courseId)
    );
    if (alreadyEnrolledCheck) {
      return res.status(400).json({ error: "Already enrolled" });
    }

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
