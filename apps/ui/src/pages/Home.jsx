import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Chip, Pagination, Stack, TextField } from "@mui/material";
import { Link as NavLink } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../redux/slices/userSlice";

export default function Home() {
  const dispatch = useDispatch();
  const [courses, setCourses] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [searchStatus, setSearchStatus] = React.useState("");
  const [searchText, setSearchText] = React.useState("");
  const token = useSelector((state) => state.token);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const getProfile = async () => {
    const res = await axios.get("http://localhost:5000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(userProfile(res.data.data));
  };

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      getProfile();
    }
    axios
      .get(
        `http://localhost:5000/courses/all?page=${page}&pageSize=5&status=${searchStatus}&search=${searchText}`
      )
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchStatus, searchText]);

  return (
    <Box>
      <Box p={3}>
        <TextField
          id="outlined-search"
          label="Search"
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <br />
        <br />
        <Stack spacing={2} direction={"row"}>
          <Typography variant="body1" component="span">
            Status:
          </Typography>
          <Chip
            label="Open"
            variant="outlined"
            onClick={(e) => setSearchStatus(e.target.innerHTML)}
            clickable
          />
          <Chip
            label="In-Progress"
            variant="outlined"
            onClick={(e) => setSearchStatus(e.target.innerHTML)}
            clickable
          />
          <Chip
            label="Closed"
            variant="outlined"
            onClick={(e) => setSearchStatus(e.target.innerHTML)}
            clickable
          />
        </Stack>
      </Box>
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
          {courses?.courses?.length > 0 ? (
            courses?.courses?.map((course) => (
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
                  <Chip
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
                    label={course.enrollmentStatus}
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <NavLink to={`/course/${course.id}`}>
                    <Button size="small" p={3}>
                      Learn More
                    </Button>
                  </NavLink>
                </CardActions>
              </Card>
            ))
          ) : (
            <Box p={5}>
              <Typography
                variant="h4"
                component="div"
                sx={{ flexGrow: 1 }}
                color="grey"
              >
                No Courses Found
              </Typography>
            </Box>
          )}
          <Stack
            width={"100%"}
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Pagination
              count={courses?.totalPages}
              onChange={handlePageChange}
              shape="rounded"
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
