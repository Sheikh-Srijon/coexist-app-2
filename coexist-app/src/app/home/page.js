"use client"

import { useContext } from "react"
import { Button, Grid, Paper, Stack, Box, Typography } from "@mui/material"
import { Logout, Chat, Settings, AccountBox } from "@mui/icons-material"
import Image from "next/image"
import "./home.css"
import { useRouter } from "next/navigation"
import { AuthContext, ThemeContext } from "../layout"

export default function SignUp() {
    const router = useRouter()
    const auth = useContext(AuthContext)
    const currentTheme = useContext(ThemeContext)

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
                            <Box display="flex" alignItems="center">
                                <Chat/>
                                <Typography className="paperTitle">Chats</Typography>
                            </Box>
                            <Box>
                                <Typography className="paperBody">
                                    Chats go in all of the space below!
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2} item justifyContent="center">
                <Grid item xs={10} md={5} justifyContent="center">
                    <Paper variant="outlined" className="subPaper">
                        <Stack spacing={1} direction="column">
                            <Box display="flex" alignItems="center">
                                <AccountBox/>
                                <Typography className="paperTitle">Profile</Typography>
                            </Box>
                            <Box>
                                <Typography className="paperBody">
                                    Profile information goes in all of the space below!
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={10} md={5} justifyContent="center">
                    <Paper variant="outlined" className="subPaper">
                        <Stack spacing={1} direction="column">
                            <Box display="flex" alignItems="center">
                                <Settings/>
                                <Typography className="paperTitle">Settings</Typography>
                            </Box>
                            <Box>
                                <Typography className="paperBody">
                                    Settings information goes in all of the space below!
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container item justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6} lg={4} display="flex" justifyContent="center">
                    <Button variant="contained" size="large" endIcon={<Logout/>} onClick={() => auth.logOut()}>Log Out</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
