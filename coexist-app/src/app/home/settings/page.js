"use client"

import { useContext, useState, useEffect } from "react"
import { Button, Box, Stack, CircularProgress, Backdrop, Typography } from "@mui/material"
import { Delete } from "@mui/icons-material"
import Image from "next/image"
import { ThemeContext, AuthContext } from "@/app/layout"
import axios from "axios"

export default function SettingsPage() {
    const auth = useContext(AuthContext)
    const currentTheme = useContext(ThemeContext)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleConfirmDeleteToggle = () => {
        setConfirmDelete(!confirmDelete)
    }

    function handleDelete(){
        axios.post("/api/account/close", auth.auth).then(res => {
            auth.logOut(auth.auth.email, auth.auth.password)
        }).catch(err => {
            console.log(`The follow error has occurred and as a result your account is NOT deleted: ${err}`)
        })
    }

    useEffect(() => {
        if(auth.auth === null){
            router.push("/")
        }
    }, [])

    return (
        auth.auth === null ?
        <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="success"/>
        </Box> 
        :
        <Box minHeight="90vh" display="flex" justifyContent="center" alignItems="center" sx={{
            mt: {xs: "20vh", md: "10vh", xl: "5vh"},
            ml: {xs: "0vh", sm: "25vw", md: "20vw"}
            }}>
            <Stack spacing={3} direction="column" justifyContent="center" alignItems="center">
                <Image priority className="focusLogo" src={currentTheme === "lightTheme" ? "/coexistLogoLight.png" : "/coexistLogoDark.png"} width={280} height={154.5} alt="placeholder logo"></Image>
                <Button className="wide-button" variant="contained" size="large">Privacy Preferences</Button>
                <Button className="wide-button" variant="contained" size="large">Terms of Service</Button>
                <Button className="wide-button" variant="contained" size="large">Support</Button>
                <Button className="wide-button" variant="contained" size="large">Your Data</Button>
                <Button className="wide-button" variant="contained" size="large" startIcon={<Delete/>} onClick={handleConfirmDeleteToggle} color="error">Delete Account</Button>
            </Stack>
            <Backdrop sx={{bgcolor: "secondary.dark", zIndex: (theme) => theme.zIndex.drawer + 1}} open={confirmDelete} onClick={handleConfirmDeleteToggle}>
                <Stack spacing={4} direction="column" justifyContent="center" p="10%">
                    <Typography>
                        Are you sure that you want to delete your account? This action CANNOT be undone!
                    </Typography>
                    <Button className="wide-button" variant="contained" size="large" onClick={handleConfirmDeleteToggle} color="warning">
                        Cancel
                    </Button>
                    <Button className="wide-button" variant="contained" size="large" startIcon={<Delete/>} onClick={() => handleDelete()} color="error">
                        Confirm Delete
                    </Button>
                </Stack>
            </Backdrop>
        </Box>
    )
}
