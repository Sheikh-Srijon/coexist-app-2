"use client"

import { Button, ThemeProvider, CssBaseline, Box, TextField, Grid } from "@mui/material"
import { Send, Email, Lock, LockOutlined, Phone, Person, PersonOutlined, Error } from "@mui/icons-material"
import { darkTheme } from "../../theme/themes"
import "./sign_up.css"

export default function SignUp() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Box height="90vh" display="flex" justifyContent="center" alignItems="center" component="form" autoComplete="off" noValidate id="signupForm">
        <Grid container width="85vw">
            <Grid item xs={12} display="flex" justifyContent="center" p="0">
                <Box className="fieldError alertHidden" id="signupErrorAlert">
                    <Error/>
                    <span>One or more errors occurred</span>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="end" p="0">
                <Box className="iconGroup">
                    <Person/>
                    <TextField required id="first" label="First Name" type="text"/>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="start" p="0">
                <Box className="iconGroup">
                    <PersonOutlined/>
                    <TextField required id="last" label="Last Name" type="text"/>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="end" p="0">
                <Box className="iconGroup">
                    <Email/>
                    <TextField required id="email" name="email" label="Email" type="email"/>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="start" p="0">
                <Box className="iconGroup">
                    <Phone/>
                    <TextField required id="phone" label="Phone Number" type="text"/>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="end" p="0">
                <Box className="iconGroup">
                    <Lock/>
                    <TextField required id="password" label="Password" type="password"/>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} display="flex" justifyContent="start" p="0">
                <Box className="iconGroup">
                    <LockOutlined/>
                    <TextField required id="confirmPassword" label="Confirm Password" type="password"/>
                </Box>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center" p="0">
                <Button variant="contained" type="submit" endIcon={<Send/>} className="submitButton">
                    Sign Up
                </Button>
            </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}
