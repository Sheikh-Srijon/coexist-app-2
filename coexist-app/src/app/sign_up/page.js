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

    // State that keeps track of the registration form's values
    const [form, setForm] = useState({
      first: "",
      last: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    })

    // State that keeps track of error text for each form value
    const [formErrorFirst, setFormErrorFirst] = useState("")
    const [formErrorLast, setFormErrorLast] = useState("")
    const [formErrorEmail, setFormErrorEmail] = useState("")
    const [formErrorPhone, setFormErrorPhone] = useState("")
    const [formErrorPassword, setFormErrorPassword] = useState("")
    const [formErrorConfirmPassword, setFormErrorConfirmPassword] = useState("")

    // State that keeps track of whether error text should be displayed on form
    const [showFormErrorFirst, setShowFormErrorFirst] = useState(false)
    const [showFormErrorLast, setShowFormErrorLast] = useState(false)
    const [showFormErrorEmail, setShowFormErrorEmail] = useState(false)
    const [showFormErrorPhone, setShowFormErrorPhone] = useState(false)
    const [showFormErrorPassword, setShowFormErrorPassword] = useState(false)
    const [showFormErrorConfirmPassword, setShowFormErrorConfirmPassword] = useState(false)

    // State that keeps track of whether the user has made an unsuccessful form submission
    const [failedSubmit, setFailedSubmit] = useState(false)

    // Check if the user has supplied a properly formatted password
    function isPasswordInvalid(password){
        if(password.length < 8){
            setShowFormErrorPassword(true)
            setFormErrorPassword("Password must be more than 8 characters")
            return true
        }
        else if(/ /.test(password)){
            setShowFormErrorPassword(true)
            setFormErrorPassword("Password cannot contain any spaces")
            return true
        }
        else{
            setShowFormErrorPassword(false)
            setFormErrorPassword("")
            return false
        }
    }

    // Check if the user has supplied a properly formatted phone number
    function isPhoneInvalid(phone){
        if(phone.length === 0){
            setShowFormErrorPhone(true)
            setFormErrorPhone("A phone number is required")
            return true
        }
        else if(!/^\d+$/.test(phone)){
            setShowFormErrorPhone(true)
            setFormErrorPhone("Phone number can only include numbers")
            return true
        }
        else{
            setShowFormErrorPhone(false)
            setFormErrorPhone("")
            return false
        }
    }

    // Check if the user has supplied a properly formatted email
    function isEmailInvalid(email){
        if(email.length === 0){
            setShowFormErrorEmail(true)
            setFormErrorEmail("An email is required")
            return true
        }
        else if(!/.*@.*\..*/.test(email)){
            setShowFormErrorEmail(true)
            setFormErrorEmail("Needs to be a valid email format")
            return true
        }
        else{
            setShowFormErrorEmail(false)
            setFormErrorEmail("")
            return false
        }
    }

    // Check if the user has supplied a properly formatted first name
    function isFirstNameInvalid(first){
        if(first.length === 0){
            setShowFormErrorFirst(true)
            setFormErrorFirst("A first name is required")
            return true
        }
        else{
            setShowFormErrorFirst(false)
            setFormErrorFirst("")
            return false
        }
    }

    // Check if the user has supplied a properly formatted last name
    function isLastNameInvalid(last){
        if(last.length === 0){
            setShowFormErrorLast(true)
            setFormErrorLast("A last name is required")
            return true
        }
        else{
            setShowFormErrorLast(false)
            setFormErrorLast("")
            return false
        }
    }

    // Check if the user has supplied matching passwords
    function doPasswordsNotMatch(password, confirmPassword){
        if(password !== confirmPassword || confirmPassword.length === 0){
            setShowFormErrorConfirmPassword(true)
            setFormErrorConfirmPassword("Passwords must match")
            return true
        }
        else{
            setShowFormErrorConfirmPassword(false)
            setFormErrorConfirmPassword("")
            return false
        }
    }
  
    // Wrapper for submitting registration form
    function handleSubmit(e){
      const firstValidity = isFirstNameInvalid(form.first.trim())
      const lastValidity = isLastNameInvalid(form.last.trim())
      const emailValidity = isEmailInvalid(form.email)
      const phoneValidity = isPhoneInvalid(form.phone)
      const passwordValidity = isPasswordInvalid(form.password)
      const confirmPasswordValidity = doPasswordsNotMatch(form.password, form.confirmPassword)

      if(firstValidity || lastValidity || emailValidity || phoneValidity || passwordValidity || confirmPasswordValidity){
        setFailedSubmit(true)
      }
      else{
        axios.post("/api/account/register", form).then(res => {
            auth.logIn(res.data)
        }).catch(err => {
            const errorMsg = document.querySelector("#signupErrorAlert")
            errorMsg.classList.remove("alertHidden")

            console.log(`The follow error has occurred and as a result you are NOT registered: ${err}`)
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
        <Box minHeight="90vh" display="flex" justifyContent="center" alignItems="center" component="form" autoComplete="off" noValidate id="signupForm" onSubmit={e => handleSubmit(e)}>
        <Grid container spacing={0.5} justifyContent="center" alignItems="center"> 
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item xs={8} display="flex" justifyContent="center">
                    <Box className="fieldError alertHidden" id="signupErrorAlert" sx={{color: "error.contrastText", bgcolor: "error.main"}}>
                        <Error/>
                        <span>We're sorry, an internal error has occurred. Please try again later.</span>
                    </Box>
                </Grid>
            </Grid>
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "end"}}>
                    <Box className="iconGroup">
                        <Person/>
                        <TextField 
                            required
                            error={showFormErrorFirst} 
                            helperText={formErrorFirst} 
                            id="first" 
                            name="first" 
                            label="First Name" 
                            type="text" 
                            className="stretchInput"
                            onChange={e => {
                                setForm({
                                    ...form,
                                    first: e.target.value,
                                })
                                setShowFormErrorFirst(failedSubmit && isFirstNameInvalid(e.target.value))
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "start"}}>
                    <Box className="iconGroup">
                        <PersonOutlined/>
                        <TextField 
                            required 
                            error={showFormErrorLast}
                            helperText={formErrorLast}  
                            id="last" 
                            name="last" 
                            label="Last Name" 
                            type="text" 
                            className="stretchInput"
                            onChange={e => {
                                setForm({
                                    ...form,
                                    last: e.target.value,
                                })
                                setShowFormErrorLast(failedSubmit && isLastNameInvalid(e.target.value))
                            }}
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
                            error={showFormErrorEmail} 
                            helperText={formErrorEmail} 
                            id="email" 
                            name="email" 
                            label="Email" 
                            type="email" 
                            className="stretchInput"
                            onChange={e => {
                                setForm({
                                    ...form,
                                    email: e.target.value,
                                })
                                setShowFormErrorEmail(failedSubmit && isEmailInvalid(e.target.value))
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "start"}}>
                    <Box className="iconGroup">
                        <Phone/>
                        <TextField 
                            required 
                            error={showFormErrorPhone}
                            helperText={formErrorPhone}  
                            id="phone" 
                            name="phone" 
                            label="Phone Number" 
                            type="tel" 
                            className="stretchInput"
                            onChange={e => {
                                setForm({
                                    ...form,
                                    phone: e.target.value,
                                })
                                setShowFormErrorPhone(failedSubmit && isPhoneInvalid(e.target.value))
                            }}
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
                            error={showFormErrorPassword} 
                            helperText={formErrorPassword} 
                            id="password" 
                            name="password" 
                            label="Password" 
                            type="password" 
                            className="stretchInput"
                            onChange={e => {
                                setForm({
                                    ...form,
                                    password: e.target.value,
                                })
                                setShowFormErrorPassword(failedSubmit && isPasswordInvalid(e.target.value))
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item sm={12} md={6} display="flex" justifyContent={{sm: "center", md: "start"}}>
                    <Box className="iconGroup">
                        <LockOutlined/>
                        <TextField 
                            required 
                            error={showFormErrorConfirmPassword} 
                            helperText={formErrorConfirmPassword} 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            label="Confirm Password" 
                            type="password" 
                            className="stretchInput"
                            onChange={e => {
                                setForm({
                                    ...form,
                                    confirmPassword: e.target.value,
                                })
                                setShowFormErrorConfirmPassword(failedSubmit && doPasswordsNotMatch(form.password, e.target.value))
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Grid container item spacing={0.5} justifyContent="center" alignItems="center">
                <Grid item xs={8} display="flex" justifyContent="center">
                    <Button className="wide-button" variant="contained" type="submit" endIcon={<Send/>} size="large">
                        Sign Up
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        </Box>
    </Box>
  )
}
