import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  List,
  ListItem,
  Modal,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { courseEnrollment, markAsCompleted } from "../redux/slices/userSlice";
import { LinearProgressWithLabel } from "../components/LinearProgressWithLabel";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "25px",
  boxShadow: 24,
  p: 4,
};

const CourseDesc = () => {
  const [open, setOpen] = React.useState(false);
  const [course, setCourse] = React.useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const token = useSelector((state) => state.token);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const handleOpen = () => {
    setOpen(true);
    if (!isLoggedIn) {
      navigate("/login");
    }
  };
  const handleClose = () => setOpen(false);

  const handleEnrollClick = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:5000/courses/getEnrolled`,
        {
          courseId: id,
          userEmail: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        dispatch(
          courseEnrollment({
            courseId: course.id,
            courseName: course.name,
            instructor: course.instructor,
            thumbnail: course.thumbnail,
            dueDate: course.dueDate,
            progress: 0,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
    handleClose();
  };

  const handleCompletedMark = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/users/course-complete",
        {
          courseId: id,
          userEmail: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    dispatch(markAsCompleted(parseInt(id)));
  };

  React.useEffect(() => {
    axios
      .get(`http://localhost:5000/courses/${id}`)
      .then((res) => {
        setCourse(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      style={{
        padding: "50px 10px 10px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please Confirm your enrollment
          </Typography>
          <br />
          <ButtonGroup sx={{ flexGrow: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEnrollClick}
            >
              Confirm
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
          </ButtonGroup>
        </Box>
      </Modal>
      {course === null ? (
        <Skeleton variant="rounded" width={"100%"} height={"300px"} />
      ) : (
        <>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "20px",
              width: "80%",
              background: "rgba(250,250,250,1)",
            }}
          >
            <Box sx={{ width: "200px", height: "200px" }}>
              <img
                src={course.thumbnail}
                alt={course.name}
                style={{ width: "100%" }}
              />
            </Box>
            <Box p={"20px"}>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                {course.name}
              </Typography>
              <br />
              <Typography variant="body1" color="text.secondary">
                Course By: {course.instructor}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Duration: {course.duration}
              </Typography>
              <br />
              <Chip
                variant="contained"
                size="small"
                color={
                  course.enrollmentStatus.toLowerCase() === "open"
                    ? "success"
                    : "primary"
                }
                label={course.enrollmentStatus}
              />
            </Box>
            <Box
              style={{
                paddingRight: "30px",
              }}
            >
              {isLoggedIn &&
              profile?.coursesEnrolled.some(
                (course) => course.courseId === parseInt(id)
              ) ? (
                <Button variant="contained" color="success">
                  ENROLLED
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={
                    course.enrollmentStatus.toLowerCase() === "closed"
                      ? true
                      : false
                  }
                  color="success"
                  onClick={handleOpen}
                >
                  ENROLL NOW
                </Button>
              )}
              <br />
              <Typography
                variant="body1"
                color="text.secondary"
                style={{ marginTop: "10px" }}
              >
                {course.location}
              </Typography>
            </Box>
          </Box>
          <br />
          {isLoggedIn &&
            profile?.coursesEnrolled.some(
              (course) => course.courseId === parseInt(id)
            ) && (
              <Box
                p={5}
                style={{
                  width: "80%",
                  background: "rgba(250,250,250,1)",
                }}
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Course Progress
                </Typography>
                <LinearProgressWithLabel
                  value={
                    profile?.coursesEnrolled.find(
                      (course) => course.courseId === parseInt(id)
                    )?.progress
                  }
                />
                <br />
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleCompletedMark}
                >
                  Mark Course as Completed
                </Button>
              </Box>
            )}
          <br />
          <Box
            p={5}
            style={{
              width: "80%",
              background: "rgba(250,250,250,1)",
            }}
          >
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Course Description
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {course.description}
            </Typography>
            <br />
            <br />
            <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
              Schedule: {course.schedule}
            </Typography>
            <br />
            <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
              Pre-requisites:
            </Typography>
            <List>
              {course.prerequisites.map((pre, index) => (
                <ListItem key={index}>{pre}</ListItem>
              ))}
            </List>
            <br />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Syllabus:
            </Typography>
            {course.syllabus.map((pre, index) => (
              <Box style={{ marginTop: "10px" }}>
                <Typography variant="body1">Week {pre.week}:</Typography>
                <Typography variant="body1">{pre.topic}</Typography>
                <Typography variant="caption">{pre.content}</Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CourseDesc;
