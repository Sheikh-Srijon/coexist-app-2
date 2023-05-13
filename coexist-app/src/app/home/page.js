"use client"

import { useContext, useState } from "react"
import { Button, Grid, Paper, Stack, Box, Typography, Backdrop, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, TextField } from "@mui/material"
import { Logout, Chat, Settings, AccountBox, Delete, Add, Search } from "@mui/icons-material"
import Image from "next/image"
import "./home.css"
import { useRouter } from "next/navigation"
import { AuthContext, ThemeContext } from "../layout"

export default function Home() {
    const router = useRouter()
    const auth = useContext(AuthContext)
    const currentTheme = useContext(ThemeContext)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const closeConfirmDelete = () => {
        setConfirmDelete(false)
    }

    const openConfirmDelete = () => {
        setConfirmDelete(true)
    }

    function handleDelete(){
        auth.logOut()
        // TODO: delete all user information for this account
    }

    return (
        auth.auth === null ? router.push("/") :
        <Grid container spacing={2} my="25px">
            <Grid container item justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                    <Image priority className="focusLogo" src={currentTheme === "lightTheme" ? "/coexistLogoLight.png" : "/coexistLogoDark.png"} width={280} height={154.5} alt="placeholder logo"></Image>
                </Grid>
            </Grid>
            <Grid container spacing={2} item justifyContent="center">
                <Grid item xs={10}>
                    <Paper variant="outlined" className="focusPaper">
                        <Stack spacing={1} direction="column">
                            <Box display="flex" alignItems="center" className="paperTop">
                                <Chat/>
                                <Typography className="paperTitle">Chats</Typography>
                            </Box>
                            <Box>
                                <Box display="flex" alignItems="center">
                                    <Search sx={{mr:1, my:0.5}}/>
                                    <TextField
                                        type="text" 
                                        id="search" 
                                        name="search" 
                                        label="Search contacts..." 
                                        sx={{width:1}} 
                                    />
                                </Box>
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar sx={{bgcolor: "blue"}}>
                                                    M
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="Mom"/>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar sx={{bgcolor: "red"}}>
                                                    B
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="Brother"/>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar sx={{bgcolor: "green"}}>
                                                    PB
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="Pam Beesly"/>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar sx={{bgcolor: "yellow"}}>
                                                    JH
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="Jim Halpert"/>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar sx={{bgcolor: "orange"}}>
                                                    MS
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="Michael Scott"/>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <Add/>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="Add New"/>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2} item justifyContent="center">
                <Grid item xs={10} md={5} justifyContent="center">
                    <Paper variant="outlined" className="subPaper">
                        <Stack spacing={1} direction="column">
                            <Box display="flex" alignItems="center" className="paperTop">
                                <AccountBox/>
                                <Typography className="paperTitle">Profile</Typography>
                            </Box>
                            <Box>
                                <Typography className="paperBody">
                                    First name: PLACEHOLDER
                                </Typography>
                                <Typography className="paperBody">
                                    Last name: PLACEHOLDER
                                </Typography>
                                <Typography className="paperBody">
                                    Email: PLACEHOLDER
                                </Typography>
                                <Typography className="paperBody">
                                    Phone: PLACEHOLDER
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={10} md={5} justifyContent="center">
                    <Paper variant="outlined" className="subPaper">
                        <Stack spacing={1} direction="column">
                            <Box display="flex" alignItems="center" className="paperTop">
                                <Settings/>
                                <Typography className="paperTitle">Settings</Typography>
                            </Box>
                            <Box className="settingsBox">
                                <Stack spacing={1} direction="column">
                                    <Button variant="contained" size="large">
                                        Privacy Preferences
                                    </Button>
                                    <Button variant="contained" size="large">
                                        Terms of Service
                                    </Button>
                                    <Button variant="contained" size="large">
                                        Support
                                    </Button>
                                    <Button variant="contained" size="large" startIcon={<Delete/>} onClick={openConfirmDelete} color="error">
                                        Delete Account
                                    </Button>
                                </Stack>
                                <Backdrop sx={{bgcolor: "secondary.dark", zIndex: (theme) => theme.zIndex.drawer + 1}} open={confirmDelete} onClick={closeConfirmDelete}>
                                    <Stack spacing={4} direction="column" justifyContent="center" p="10%">
                                        <Typography>
                                            Are you sure that you want to delete your account? This action CANNOT be undone!
                                        </Typography>
                                        <Button variant="contained" size="large" onClick={closeConfirmDelete}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" size="large" startIcon={<Delete/>} onClick={() => handleDelete()} color="error">
                                            Confirm Delete
                                        </Button>
                                    </Stack>
                                </Backdrop>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container item justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                    <Button variant="contained" size="large" startIcon={<Logout/>} onClick={() => auth.logOut()}>Log Out</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
