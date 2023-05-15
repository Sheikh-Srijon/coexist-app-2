"use client"

import { useState, useContext, useEffect } from "react"
import { Button, Box, Stack, TextField, CircularProgress } from "@mui/material"
import { Send, Email, Lock, Error } from "@mui/icons-material"
import "./login.css"
import { useRouter } from "next/navigation"
import { AuthContext } from "../layout"

export default function Login() {
  const router = useRouter()
  const auth = useContext(AuthContext)

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  function handleSubmit(e){
    const email = form.email.replace(/\s+/g, "")
    const password = form.password.replace(/\s+/g, "")

    if(email.length === 0 || password.length === 0){
      const errorMsg = document.querySelector("#loginErrorAlert")
      errorMsg.classList.remove("alertHidden")
    }
    else{
      auth.logIn(email, password)
    }

    e.preventDefault()
  }

  useEffect(() => {
    if(auth.auth !== null){
      router.push("/home")
    }
  }, [])

  return (
    auth.auth !== null ?
    <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress color="success"/>
    </Box> 
    :
    <Box minHeight="90vh" display="flex" justifyContent="center" alignItems="center" component="form" autoComplete="off" noValidate id="loginForm" onSubmit={e => handleSubmit(e)}>
      <Stack spacing={2}>
        <Box className="fieldError alertHidden" id="loginErrorAlert" sx={{color: "error.contrastText", bgcolor: "error.main"}}>
          <Error/>
          <span>Incorrect username and/or password</span>
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
          <Button variant="contained" type="submit" endIcon={<Send/>} size="large">
            Login
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
