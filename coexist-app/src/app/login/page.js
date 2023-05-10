"use client"

import { Button, ThemeProvider, CssBaseline, Box, Stack, TextField } from "@mui/material"
import { Send, Email, Lock, Error } from "@mui/icons-material"
import { darkTheme } from "../../theme/themes"
import "./login.css"

export default function Login() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Box height="90vh" display="flex" justifyContent="center" alignItems="center" component="form" autoComplete="off" noValidate id="loginForm">
        <Stack spacing={2}>
            <Box className="fieldError alertHidden" id="loginErrorAlert">
                <Error/>
                <span>Incorrect username and/or password</span>
            </Box>
            <Box className="iconGroup">
                <Email/>
                <TextField required id="email" name="email" label="Email" type="email" className="stretchInput"/>
            </Box>
            <Box className="iconGroup">
                <Lock/>
                <TextField required id="password" name="password" label="Password" type="password" className="stretchInput"/>
            </Box>
            <Button variant="contained" type="submit" endIcon={<Send/>} className="submitButton">
                Login
            </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}
