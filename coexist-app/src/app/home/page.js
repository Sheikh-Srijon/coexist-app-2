"use client"

import { useContext, useState, useEffect } from "react"
import { Button, Grid, Paper, Stack, Box, Typography, Backdrop, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, TextField, CircularProgress } from "@mui/material"
import { Logout, Chat, Settings, AccountBox, Delete, Add, Search } from "@mui/icons-material"
import Image from "next/image"
import "./home.css"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthContext, ThemeContext } from "../layout"
import axios from "axios"

let dummyData = [
    {
        name: "Mom",
        _id: 1
    },
    {
        name: "Brother",
        _id: 2
    },
    {
        name: "Michael Scott",
        _id: 3
    },
    {
        name: "Pam Beesly",
        _id: 4
    },
    {
        name: "Jim Halpert",
        _id: 5
    }
]
let id = 6

export default function Home() {
    const router = useRouter()
    const auth = useContext(AuthContext)
    const currentTheme = useContext(ThemeContext)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [addNew, setAddNew] = useState(false)
    const [search, setSearch] = useState("")
    const [form, setForm] = useState("")

    const closeConfirmDelete = () => {
        setConfirmDelete(false)
    }

    const openConfirmDelete = () => {
        setConfirmDelete(true)
    }

    const closeAddNew = () => {
        setAddNew(false)
    }

    const openAddNew = () => {
        setAddNew(true)
    }

    function handleAddNew(){
        dummyData.push({
            name: form,
            _id: id
        })
        id++
        setForm("")
        setAddNew(false)
        document.getElementById("newChat").value = "" // TODO: this needs to be changed because it is kind of hacky and doesn't fully update UI
    }

    function displayChats(data){
        let chatList
        let wantedChats = data

        if(search.length > 0){
            wantedChats = wantedChats.filter(chat => {
                return chat.name.toLowerCase().includes(search.toLowerCase())
            })
        }
        
        chatList = wantedChats.map(chat => {
            const words = chat.name.split(" ")
            let initials = words[0][0]

            if(words.length > 1){
                initials = words[0][0] + words[1][0]
            }

            return (
            <Link href={`/chat/${chat.name}`} key={chat._id}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar>
                                {initials}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={chat.name}/>
                    </ListItemButton>
                </ListItem>
            </Link>
            )
        })

        if(search.length === 0){
            chatList.push(
                <ListItem disablePadding key={0} onClick={openAddNew}>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar>
                                <Add/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Add New"/>
                    </ListItemButton>
                </ListItem>
            )
        }

        return (
            <List>
                {chatList}
            </List>
        )
    }

    function handleDelete(){
        axios.post("/api/account/close", auth.auth).then(res => {
            auth.logOut(auth.auth.email, auth.auth.password)
        }).catch(err => {
            console.log(`The follow error has occurred and as a result your account is NOT deleted: ${err}`)
        })
    }

    function handleLogout(){
        auth.logOut(auth.auth.email, auth.auth.password)
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
                                        onChange={e => 
                                            setSearch(e.target.value)
                                        }
                                    />
                                </Box>
                                {displayChats(dummyData)}
                                <Backdrop sx={{bgcolor: "secondary.main", zIndex: (theme) => theme.zIndex.drawer + 1}} open={addNew}>
                                    <Stack spacing={4} direction="column" justifyContent="center" alignItems="center" p="10%">
                                        <TextField 
                                            required 
                                            id="newChat" 
                                            name="newChat" 
                                            label="Enter name..." 
                                            type="text" 
                                            className="stretchInput"
                                            onChange={e => setForm(e.target.value)}
                                        />
                                        <Button variant="contained" size="large" onClick={closeAddNew} color="warning">
                                            Cancel
                                        </Button>
                                        <Button variant="contained" size="large" startIcon={<Add/>} onClick={() => handleAddNew()} color="success">
                                            Add Chat
                                        </Button>
                                    </Stack>
                                </Backdrop>
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
                                    First name: {auth.auth.firstName}
                                </Typography>
                                <Typography className="paperBody">
                                    Last name: {auth.auth.lastName}
                                </Typography>
                                <Typography className="paperBody">
                                    Email: {auth.auth.email}
                                </Typography>
                                <Typography className="paperBody">
                                    Phone: {auth.auth.phone}
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
                                        <Button variant="contained" size="large" onClick={closeConfirmDelete} color="warning">
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
                    <Button variant="contained" size="large" startIcon={<Logout/>} onClick={() => handleLogout()}>Log Out</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
