import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Link as NavLink } from "react-router-dom";
import axios from "axios";
import { userProfile } from "../redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const [courses, setCourses] = React.useState([]);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  React.useEffect(() => {
    axios
      .get("http://localhost:5000/courses/all")
      .then((res) => {
        setCourses(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    if (token)
      axios
        .get("http://localhost:5000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          dispatch(userProfile(res.data.data));
        })
        .catch((err) => {
          console.log(err);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box p={5}>
      <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
        Courses we offer
      </Typography>
      <Box
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
        }}
      >
        {courses.length > 0 &&
          courses.map((course) => (
            <Card sx={{ maxWidth: 280 }} key={course.id}>
              <CardMedia
                sx={{ height: 150 }}
                image={course.thumbnail}
                title={course.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <br />
                <Typography variant="body2" color="text.secondary">
                  Course By: {course.instructor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {course.duration}
                </Typography>
              </CardContent>
              <CardActions style={{ padding: "20px" }}>
                <Button
                  variant="contained"
                  size="small"
                  color={
                    course.enrollmentStatus.toLowerCase() === "open"
                      ? "success"
                      : "primary"
                  }
                  disabled={
                    course.enrollmentStatus.toLowerCase() === "closed"
                      ? true
                      : false
                  }
                >
                  {course.enrollmentStatus}
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <NavLink to={`/course/${course.id}`}>
                  <Button size="small" p={3}>
                    Learn More
                  </Button>
                </NavLink>
              </CardActions>
            </Card>
          ))}
      </Box>
    </Box>
  );
}
