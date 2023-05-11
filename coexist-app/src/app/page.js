"use client"

import { Button, ThemeProvider, CssBaseline, Box, Stack } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { darkTheme } from "../theme/themes"
import "./globals.css"

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Box height="90vh" display="flex" justifyContent="center" alignItems="center">
        <Stack spacing={3}>
          <Image src="/coexistLogoDark.png" width={280} height={154.5} alt="placeholder logo"></Image>
          <Box display="flex" justifyContent="center"><Link href="/login"><Button variant="contained" size="large">Login</Button></Link></Box>
          <Box display="flex" justifyContent="center"><Link href="/sign_up"><Button variant="contained" size="large">Sign Up</Button></Link></Box>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}
