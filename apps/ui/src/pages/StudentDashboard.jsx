import { Box, Divider, LinearProgress, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const CourseCard = ({ course }) => {
  return (
    <Box
      m={3}
      style={{
        width: "270px",
        height: "130px",
        display: "flex",
        flexDirection: "row",
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
          {course.dueDate}
        </Typography>
        <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
          {course.name}
        </Typography>
        <br />
        <LinearProgressWithLabel value={course.progress} />
      </Box>
    </Box>
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
  }, [isLoggedIn]);
  console.log(profile);
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
                {profile.coursesEnrolled?.map((course) => (
                  <CourseCard course={course} />
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
