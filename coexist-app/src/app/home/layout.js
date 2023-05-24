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
      children
    )
  }
  