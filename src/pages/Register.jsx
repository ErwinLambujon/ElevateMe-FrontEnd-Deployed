import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useTheme from "@mui/material/styles/useTheme";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from '../helpers/axios';
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { API_BASE_URL } from '../helpers/constant';


const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    user_type: "STUDENT",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  
  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleRegistration = async (e) => {
    e.preventDefault();
  
    if (userData.password !== userData.confirmPassword) {
      setSnackbar({ open: true, message: "Passwords do not match.", severity: "error" });
      setUserData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      return;
    }
  
    if (userData.password.length < 6) {
      setSnackbar({ open: true, message: "Password must be at least 6 characters long.", severity: "error" });
      return;
    }
  
    try {
      const formattedUserData = {
        ...userData,
        first_name: capitalizeName(userData.first_name),
        last_name: capitalizeName(userData.last_name),
      };
      // console.log(API_BASE_URL);
      const response = await axiosInstance.post(`/api/user/`, formattedUserData);

  
      if (response.status === 201) {
        setSnackbar({ open: true, message: "User created successfully!", severity: "success" });
        setUserData({
          email: "",
          first_name: "",
          last_name: "",
          password: "",
          confirmPassword: "",
          user_type: "STUDENT",
        });
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        const { data } = err.response;
        if (data.email) {
          setSnackbar({ open: true, message: data.email[0], severity: "error" });
          setUserData((prev) => ({
            ...prev,
            email: "",
          }));
        }
      }
    }
  };
  

  useEffect(() => {
    // console.log(userData);
  }, [userData]);

  const inputProps = {
    sx: {
      borderRadius: "50px",
      "& fieldset": { borderColor: "stroke.main" },
    },
  };

  const inputSx = {
    boxSizing: "border-box",
    width: "100%",
  };

  const inputFieldContainer = {
    paddingTop: "15px",
    paddingBottom: "15px",
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Grid
      container
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={11} md={5} xl={5}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "32px",
            paddingTop: "50px",
            paddingBottom: "50px",
            userSelect: "none",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: theme.palette.primary.main,
            }}
          >
            ElevateMe
          </h1>
          <form onSubmit={handleRegistration}>
            <FormControl
              sx={{
                width: "100%",
                boxSizing: "border-box",
                paddingLeft: "5rem",
                paddingRight: "5rem",
              }}
            >
              <Box sx={inputFieldContainer}>
                <TextField
                  InputProps={inputProps}
                  sx={inputSx}
                  placeholder="First Name"
                  type="text"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={inputFieldContainer}>
                <TextField
                  InputProps={inputProps}
                  sx={inputSx}
                  placeholder="Last Name"
                  type="text"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={inputFieldContainer}>
                <TextField
                  InputProps={inputProps}
                  sx={inputSx}
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={inputFieldContainer}>
                <TextField
                  InputProps={inputProps}
                  sx={inputSx}
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={inputFieldContainer}>
                <TextField
                  InputProps={inputProps}
                  sx={inputSx}
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Box>
              <Box sx={inputFieldContainer}>
                <TextField
                  select
                  InputProps={inputProps}
                  sx={inputSx}
                  name="user_type"
                  value={userData.user_type}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="STUDENT">Student</MenuItem>
                  <MenuItem value="TEACHER">Teacher</MenuItem>
                </TextField>
              </Box>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: "50rem",
                  width: "100%",
                  boxSizing: "border-box",
                  height: "4rem",
                  marginTop: "3rem",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Sign up
              </Button>
            </FormControl>
          </form>
          <Box sx={{ marginTop: "1rem" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "primary.main",
                textDecoration: "none",
              }}
            >
              Log in
            </Link>
          </Box>
        </Paper>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Register;
