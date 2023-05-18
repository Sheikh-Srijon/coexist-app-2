"use client"

import { useState, useContext, useEffect } from "react"
import { Button, Box, TextField, Grid, CircularProgress, Typography } from "@mui/material"
import { Send, Email, Lock, LockOutlined, Phone, Person, PersonOutlined, Error, ArrowBackIosNew } from "@mui/icons-material"
import "./sign_up.css"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthContext } from "../layout"
import axios from "axios"

export default function SignUp() {
    const router = useRouter()
    const auth = useContext(AuthContext)

    const [form, setForm] = useState({
      first: "",
      last: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    })
  
    function handleSubmit(eve){
      const first = form.first.replace(/\s+/g, "")
      const last = form.last.replace(/\s+/g, "")
      const email = form.email.replace(/\s+/g, "")
      const phone = form.phone.replace(/\s+/g, "")
      const password = form.password.replace(/\s+/g, "")
      const confirmPassword = form.confirmPassword.replace(/\s+/g, "")

      const errorMsg = document.querySelector("#signupErrorAlert")
  
      if(first.length === 0 || last.length === 0 || email.length === 0 || phone.length === 0 || password.length < 8 || confirmPassword.length < 8 || password !== confirmPassword){
        errorMsg.classList.remove("alertHidden")
      }
      else{
        axios.post("/api/account/register", form, {validateStatus: status => status < 399}).then(res => {
            auth.logIn(email, password)
        }).catch(err => {
            console.log(`The follow error has occurred and as a result you are NOT registered: ${err}`)
            errorMsg.classList.remove("alertHidden")
        })
      }
  
      eve.preventDefault()
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
    <Box>
        <Link href="/">
            <Button size="large" startIcon={<ArrowBackIosNew/>} className="returnButton">
                Go Back
            </Button>
        </Link>
        <Box minHeight="90vh" display="flex" justifyContent="center" alignItems="center" component="form" autoComplete="off" noValidate id="signupForm" onSubmit={e => handleSubmit(e)}>
        <Grid container spacing={0.5} justifyContent="center" alignItems="center"> 
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item xs={8} display="flex" justifyContent="center">
                    <Box className="fieldError alertHidden" id="signupErrorAlert" sx={{color: "error.contrastText", bgcolor: "error.main"}}>
                        <Error/>
                        <span>One or more errors occurred</span>
                    </Box>
                </Grid>
            </Grid>
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "end"}}>
                    <Box className="iconGroup">
                        <Person/>
                        <TextField 
                            required 
                            id="first" 
                            name="first" 
                            label="First Name" 
                            type="text" 
                            className="stretchInput"
                            onChange={e => 
                                setForm({
                                    ...form,
                                    first: e.target.value,
                                })
                            }
                        />
                    </Box>
                </Grid>
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "start"}}>
                    <Box className="iconGroup">
                        <PersonOutlined/>
                        <TextField 
                            required 
                            id="last" 
                            name="last" 
                            label="Last Name" 
                            type="text" 
                            className="stretchInput"
                            onChange={e => 
                                setForm({
                                    ...form,
                                    last: e.target.value,
                                })
                            }
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "end"}}>
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
                </Grid>
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "start"}}>
                    <Box className="iconGroup">
                        <Phone/>
                        <TextField 
                            required 
                            id="phone" 
                            name="phone" 
                            label="Phone Number" 
                            type="tel" 
                            className="stretchInput"
                            onChange={e => 
                                setForm({
                                    ...form,
                                    phone: e.target.value,
                                })
                            }
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "end"}}>
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
                </Grid>
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "start"}}>
                    <Box className="iconGroup">
                        <LockOutlined/>
                        <TextField 
                            required 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            label="Confirm Password" 
                            type="password" 
                            className="stretchInput"
                            onChange={e => 
                                setForm({
                                    ...form,
                                    confirmPassword: e.target.value,
                                })
                            }
                        />
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
    </Box>
  )
}
