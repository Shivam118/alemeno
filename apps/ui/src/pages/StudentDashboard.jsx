import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LinearProgressWithLabel } from "../components/LinearProgressWithLabel";

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/course/${course.courseId}`}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Box
        style={{
          minWidth: "250px",
          // height: "130px",
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          flexWrap: "wrap",
          // border: "1px solid #ccc",
        }}
      >
        <Box style={{ height: "100px", width: "100px" }}>
          <img
            src={course.thumbnail}
            alt={course.name}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
        <Box p={3}>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            {course.courseName}
          </Typography>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            {course.instructor}
          </Typography>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            Due: {course.dueDate}
          </Typography>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            {course.name}
          </Typography>
          <br />
          <LinearProgressWithLabel value={course.progress} />
        </Box>
      </Box>
    </Link>
  );
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const profile = useSelector((state) => state.profile);

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box p={5}>
      <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
        User Dashboard
      </Typography>
      {isLoggedIn && profile ? (
        <Box p={3} style={{ borderRadius: "10px", border: "1px solid #aaa" }}>
          <Box p={3} style={{ borderRadius: "10px", border: "1px solid #aaa" }}>
            <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
              Welcome, {profile.firstName + " " + profile.lastName}
            </Typography>
            <Divider />
            <br />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ID: {profile.id}
              <br />
              Email: {profile.email}
              <br />
              First Name: {profile.firstName}
              <br />
              Last Name: {profile.lastName}
              <br />
              Phone Number: {profile.phone}
              <br />
            </Typography>
          </Box>
          <br />
          <Divider />
          <br />
          <Box p={3} style={{ borderRadius: "10px", border: "1px solid #aaa" }}>
            <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
              Courses Enrolled: {profile.coursesEnrolled?.length}
              <br />
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {profile.coursesEnrolled?.map((course, index) => (
                  <CourseCard course={course} key={index} />
                ))}
              </Box>
            </Typography>
          </Box>
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export default StudentDashboard;
