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
        <Grid container spacing={0.5} justifyContent="center" alignItems="center"> 
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item xs={8} display="flex" justifyContent="center">
                    <Box className="fieldError alertHidden" id="signupErrorAlert">
                        <Error/>
                        <span>One or more errors occurred</span>
                    </Box>
                </Grid>
            </Grid>
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "end"}}>
                    <Box className="iconGroup">
                        <Person/>
                        <TextField required id="first" label="First Name" type="text" className="stretchInput"/>
                    </Box>
                </Grid>
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "start"}}>
                    <Box className="iconGroup">
                        <PersonOutlined/>
                        <TextField required id="last" label="Last Name" type="text" className="stretchInput"/>
                    </Box>
                </Grid>
            </Grid>
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "end"}}>
                    <Box className="iconGroup">
                        <Email/>
                        <TextField required id="email" name="email" label="Email" type="email" className="stretchInput"/>
                    </Box>
                </Grid>
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "start"}}>
                    <Box className="iconGroup">
                        <Phone/>
                        <TextField required id="phone" label="Phone Number" type="text" className="stretchInput"/>
                    </Box>
                </Grid>
            </Grid>
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "end"}}>
                    <Box className="iconGroup">
                        <Lock/>
                        <TextField required id="password" label="Password" type="password" className="stretchInput"/>
                    </Box>
                </Grid>
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "start"}}>
                    <Box className="iconGroup">
                        <LockOutlined/>
                        <TextField required id="confirmPassword" label="Confirm Password" type="password" className="stretchInput"/>
                    </Box>
                </Grid>
            </Grid>
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item xs={8} display="flex" justifyContent="center">
                    <Button variant="contained" type="submit" endIcon={<Send/>} size="large">
                        Sign Up
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        </Box>
    </ThemeProvider>
  )
}
