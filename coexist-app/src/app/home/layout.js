"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { AppBar, Button, Box, Fade, Alert, AlertTitle, Typography, List, ListItem, ListItemIcon, ListItemButton, ListItemText, ListItemAvatar, Avatar, TextField, CircularProgress, Toolbar, IconButton, Tooltip, Menu, MenuItem, Drawer, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { Logout, Settings, Add, Search } from "@mui/icons-material"
import MenuIcon from "@mui/icons-material/Menu"
import "./home.css"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthContext } from "../layout"
import fuzzysort from "fuzzysort"
import axios from "axios"

export const ViewContext = createContext(null)

function useView(){
    const [currentView, setCurrentView] = useState("")

    const changeView = useCallback((newView) => {
        setCurrentView(newView)
    }, [setCurrentView])

    return {currentView, changeView}
}

export default function HomeLayout({ children }) {
    const router = useRouter()
    const auth = useContext(AuthContext)
    const view = useView()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [addNew, setAddNew] = useState(false)
    const [search, setSearch] = useState("")
    const [form, setForm] = useState("")
    const [anchorElUser, setAnchorElUser] = useState(null)
    const [showChatError, setShowChatError] = useState(false)
    const [showChatSuccess, setShowChatSuccess] = useState(false)
    const [chats, setChats] = useState([])

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
        const data = {
            user: auth.auth,
            newEmail: form
        }

        axios.post("/api/chat/add_chat", data).then(res => {
            setChats((prevChats) => [...prevChats, res.data])
            setShowChatSuccess(true)
            setForm("")
        }).catch(err => {
            // TODO: add more thorough error checking
            console.log(`The follow error has occurred and as a result the chats are not fetched: ${err}`)
            setShowChatError(true)
        })

        setAddNew(false)
    }

    function getChats(data){
        let chatList
        let wantedChats = data

        if(search.length > 0){
            wantedChats = fuzzysort.go(search, wantedChats, {key: "name"})
            wantedChats = wantedChats.map(chat => chat.obj)
        }
        
        chatList = wantedChats.map(chat => {
            // chat is currently a list of emails that correspond to the users involved in a chat; for now this is just two people (so only one name is returned)
            const words = chat.join(", ") // TODO: replace this so it picks first and last name and change the code below accordingly
            let initials = words[0][0]

            if(words.length > 1){
                initials = words[0][0] + words[1][0]
            }

            return (
            <Link href={`/home/chat/${chat}`} key={chat._id}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar sx={{color: "inherit"}}>
                                {initials}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={chat}/>
                    </ListItemButton>
                </ListItem>
            </Link>
            )
        })

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

        axios.post("/api/chat/get_chats", auth.auth).then(res => {
            setChats(res.data)
        }).catch(err => {
            // TODO: add more thorough error checking
            console.log(`The follow error has occurred and as a result the chats are not fetched: ${err}`)
        })
    }, [])

    return (
        auth.auth === null ?
        <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="success"/>
        </Box> 
        :
        <ViewContext.Provider value={view}>
            <Box>
                <Fade in={showChatError} timeout={500} addEndListener={() => {
                    setTimeout(() => setShowChatError(false), 3500)
                }}>
                    <Alert severity="error" 
                    sx={{top: "1rem", marginX: "1rem", position: "fixed", zIndex: (theme) => theme.zIndex.drawer + 1}}
                    onClose={() => {setShowChatError(false)}}
                    >
                        <AlertTitle>Error</AlertTitle>
                        New chat has <strong>not</strong> been added!
                    </Alert>
                </Fade>
                <Fade in={showChatSuccess} timeout={500} addEndListener={() => {
                    setTimeout(() => setShowChatSuccess(false), 3500)
                }}>
                    <Alert severity="success" 
                    sx={{top: "1rem", marginX: "1rem", position: "fixed", zIndex: (theme) => theme.zIndex.drawer + 1}}
                    onClose={() => {setShowChatSuccess(false)}}
                    >
                        <AlertTitle>Success</AlertTitle>
                        New chat has been added!
                    </Alert>
                </Fade>
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
                            noWrap
                            variant="h6"
                            sx={{
                            mx: 4,
                            display: "flex",
                            flexGrow: 1,
                            justifyContent: {xs: "center", sm: "start"},
                            fontWeight: 700,
                            letterSpacing: "0.1rem",
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            {view.currentView}
                        </Typography>

                        <Box sx={{justifySelf: "end"}}>
                            <Tooltip title="Open your profile">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mx: 3 }}>
                                <Avatar sx={{bgcolor: "secondary.light", color: "inherit"}}>
                                    {auth.auth.firstName[0]}
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
                                <Link href="/home/settings" onClick={handleCloseUserMenu}>
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
                    sx={{ width: { sm: "25vw", md: "20vw" }, flexShrink: { sm: 0 }}}
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
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: "65vw", bgcolor: "primary.dark", overscrollBehaviorY: "contain" },
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                            m: 1,
                            fontWeight: 700,
                            textAlign: "center",
                            letterSpacing: "0.1rem",
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            Chats
                        </Typography>
                        <Box display="flex" alignItems="center" p="15px" pb="5px"> 
                            <TextField
                                type="text" 
                                id="search" 
                                name="search" 
                                label="Search" 
                                sx={{width:1}} 
                                onChange={e => 
                                    setSearch(e.target.value)
                                }
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><Search/></InputAdornment>,
                                }}
                            />
                        </Box>
                        {getChats(chats)}
                        <List sx={{bottom: 0, position: "absolute", width: "100%", bgcolor: "background.paper"  }}>
                            <ListItem disablePadding onClick={handleAddNewToggle}>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar sx={{color: "inherit"}}>
                                            <Add/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Add New"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: {sm: "25vw", md: "20vw"}, bgcolor: "primary.dark", overscrollBehaviorY: "contain" },
                        }}
                        open
                    >
                        <Typography
                            variant="h6"
                            sx={{
                            m: 2,
                            fontWeight: 700,
                            textAlign: "center",
                            letterSpacing: "0.1rem",
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            Chats
                        </Typography>
                        <Box display="flex" alignItems="center" p="15px" pb="5px"> 
                            <TextField
                                type="text" 
                                id="search" 
                                name="search" 
                                label="Search" 
                                sx={{width:1}} 
                                onChange={e => 
                                    setSearch(e.target.value)
                                }
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><Search/></InputAdornment>,
                                }}
                            />
                        </Box>
                        {getChats(chats)}
                        <List sx={{bottom: 0, position: "absolute", width: "100%", bgcolor: "background.paper"  }}>
                            <ListItem disablePadding onClick={handleAddNewToggle}>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar sx={{color: "inherit"}}>
                                            <Add/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Add New"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Drawer>
                    <Dialog open={addNew} onClose={handleAddNewToggle}>
                        <DialogTitle>Add New Chat</DialogTitle>
                        <DialogContent>
                        <DialogContentText mb={1}>
                            Enter an email to add that user!
                        </DialogContentText>
                        <TextField 
                                required 
                                id="newChat" 
                                name="newChat" 
                                label="Email" 
                                type="text" 
                                className="stretchInput"
                                onChange={e => setForm(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" size="large" color="warning" onClick={handleAddNewToggle}>Cancel</Button>
                            <Button variant="contained" size="large" color="success" onClick={() => handleAddNew()} startIcon={<Add/>} disabled={!form.trim()}>Add</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                {children}
            </Box>
        </ViewContext.Provider>
    )
}
