const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const { isLoggedIn } = require("./middleware");
const userList = require("../db/users.json");
const fs = require("fs");
const path = require("path");

// router.post("/signup", async (req, res) => {
//   const { User } = req.context.models;
//   const { name, email, password} = req.body;
//   if (!name || !email || !password) {
//     res.status(400).json({ message: "Please enter all fields" });
//   }

//   try {
//     const userExist = await User.findOne({ email: email });
//     if (userExist) {
//       return res
//         .status(422)
//         .json({ message: "User with this email Already Exists" });
//     }
//     const hashPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       password: hashPassword,
//       type,
//     });
//     res.status(201).json({ message: "User Details Saved Successfully" });
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// });

router.post("/login", async (req, res) => {
  // const { User } = req.context.models;
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Please enter all fields" });
  }
  try {
    // const user = await User.findOne({ username, type });
    const user = userList.find((user) => user.email === email);
    if (user) {
      // const result = await bcrypt.compare(password, user.password);
      const result = user.password === password;
      if (result) {
        const token = await jwt.sign(
          {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          SECRET
        );
        return res.status(200).json({ token });
      } else {
        return res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      return res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/me", isLoggedIn, async (req, res) => {
  try {
    const { email } = req.user;
    const user = userList.find((user) => user.email === email);
    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/course-complete", isLoggedIn, async (req, res) => {
  try {
    const { courseId, userEmail } = req.body;
    if (!courseId || !userEmail) {
      return res.status(400).json({ error: "Please enter all fields" });
    }
    const user = userList.find((user) => user.email === userEmail);
    // const course = courseList.find(
    //   (course) => course.id === parseInt(courseId)
    // );

    const alreadyCompletedCheck = user.coursesEnrolled.find(
      (course) => course.courseId === parseInt(courseId)
    );

    if (alreadyCompletedCheck.progress === 100) {
      return res.status(400).json({ error: "Already completed" });
    }

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
        const courseIndex = users[userIndex].coursesEnrolled.findIndex(
          (course) => course.courseId === parseInt(courseId)
        );
        users[userIndex].coursesEnrolled[courseIndex].progress = 100;

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

    return res.status(200).json({ data: "Course Completed Successfully" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
