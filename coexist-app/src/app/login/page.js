"use client"

import { useState, useContext, useEffect } from "react"
import { Button, Box, Stack, TextField, CircularProgress, Typography } from "@mui/material"
import { Send, Email, Lock, Error, ArrowBackIosNew } from "@mui/icons-material"
import "./login.css"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthContext } from "../layout"
import axios from "axios"

export default function Login() {
  const router = useRouter()
  const auth = useContext(AuthContext)

  // State that keeps track of the login form's values
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  // Wrapper for submitting login form
  function handleSubmit(e){
    const email = form.email.trim()
    const password = form.password.replace(/\s+/g, "")

    const errorMsg = document.querySelector("#loginErrorAlert")

    if(email.length === 0 || password.length === 0){
      errorMsg.classList.remove("alertHidden")
    }
    else{
      axios.post("/api/account/login", {email: email, password: password}).then(res => {
        auth.logIn(res.data)
      }).catch(err => {
        errorMsg.classList.remove("alertHidden")
      })
    }

    e.preventDefault()
  }

  useEffect(() => {
    if(auth.auth !== null){
      router.push("/home/settings")
    }
  }, [])

  return (
    auth.auth !== null ?
    <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress color="success"/>
    </Box> 
    :
    <Box>
      <Link href="/">
        <Button size="large" startIcon={<ArrowBackIosNew/>} className="returnButton">
          Go Back
        </Button>
      </Link>
      <Box minHeight="90vh" display="flex" justifyContent="center" alignItems="center" component="form" autoComplete="off" noValidate id="loginForm" onSubmit={e => handleSubmit(e)}>
        <Stack spacing={2}>
          <Box className="fieldError alertHidden" id="loginErrorAlert" sx={{color: "error.contrastText", bgcolor: "error.main"}}>
            <Error/>
            <span>Incorrect email and/or password</span>
          </Box>
          <Box className="iconGroup">
            <Email/>
            <TextField 
              required 
              id="email" 
              name="email" 
              label="Email" 
              type="email" 
              className="stretchInput"
              onChange={e => 
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </Box>
          <Box className="iconGroup">
            <Lock/>
            <TextField 
              required 
              id="password" 
              name="password" 
              label="Password" 
              type="password" 
              className="stretchInput"
              onChange={e => 
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <Button className="wide-button" variant="contained" type="submit" endIcon={<Send/>} size="large">
              Login
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
