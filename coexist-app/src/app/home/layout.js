"use client"

import { useContext, useState, useEffect } from "react"
import { AppBar, Button, Stack, Box, Typography, Backdrop, List, ListItem, ListItemIcon, ListItemButton, ListItemText, ListItemAvatar, Avatar, TextField, CircularProgress, Toolbar, IconButton, Tooltip, Menu, MenuItem, Drawer } from "@mui/material"
import { Logout, Settings, Add, Search } from "@mui/icons-material"
import MenuIcon from "@mui/icons-material/Menu"
import "./home.css"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthContext } from "../layout"
import fuzzysort from "fuzzysort"

let dummyData = [
    {
        name: "Mom",
        _id: 1
    },
    {
        name: "Brother",
        _id: 2
    }
]
let id = 3

export default function HomeLayout({ children }) {
    const router = useRouter()
    const auth = useContext(AuthContext)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [addNew, setAddNew] = useState(false)
    const [search, setSearch] = useState("")
    const [form, setForm] = useState("")
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const handleAddNewToggle = () => {
        setAddNew(!addNew)
    }

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
      };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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

    function getChats(data){
        let chatList
        let wantedChats = data

        if(search.length > 0){
            wantedChats = fuzzysort.go(search, wantedChats, {key: "name"})
            wantedChats = wantedChats.map(chat => chat.obj)
        }
        
        chatList = wantedChats.map(chat => {
            const words = chat.name.split(" ")
            let initials = words[0][0]

            if(words.length > 1){
                initials = words[0][0] + words[1][0]
            }

            return (
            <Link href={`/home/chat/${chat.name}`} key={chat._id}>
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
                <ListItem disablePadding key={0} onClick={handleAddNewToggle}>
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
        <Box>
            <AppBar
                position="fixed"
                sx={{
                width: { xs: "100vw", sm: "75vw", md: "80vw" },
                ml: { xs: "0vw", sm: "25vw", md: "20vw" },
                }}
            >
                <Toolbar disableGutters>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        sx={{justifySelf: "start", mx: 4, display: {xs: "inline-flex", sm: "none"}}}
                    >
                        <MenuIcon/>
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                        mx: 4,
                        display: "flex",
                        flexGrow: 1,
                        justifyContent: {xs: "center", sm: "start"},
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                        Hi, {auth.auth.firstName}
                    </Typography>

                    <Box sx={{justifySelf: "end"}}>
                        <Tooltip title="Open your profile">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mx: 3 }}>
                            <Avatar sx={{bgcolor: "secondary.light"}}>
                                U
                            </Avatar>
                        </IconButton>
                        </Tooltip>
                        <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        >
                            <Link href="/home/settings">
                                <MenuItem>
                                    <ListItemIcon>
                                        <Settings/>
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                            </Link>
                            <MenuItem onClick={() => handleLogout()}>
                                <ListItemIcon>
                                    <Logout/>
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
                aria-label="chat navigation"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: "65vw" },
                    }}
                    >
                    <Box display="flex" alignItems="center" p="15px" pb="5px">
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
                    {getChats(dummyData)}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: {sm: "25vw", md: "20vw"}, },
                    }}
                    open
                    >
                    <Box display="flex" alignItems="center" p="15px" pb="5px"> 
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
                    {getChats(dummyData)}
                </Drawer>
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
                        <Button variant="contained" size="large" onClick={handleAddNewToggle} color="warning">
                            Cancel
                        </Button>
                        <Button variant="contained" size="large" startIcon={<Add/>} onClick={() => handleAddNew()} color="success">
                            Add Chat
                        </Button>
                    </Stack>
                </Backdrop>
            </Box>

            {children}
        </Box>
    )
}
