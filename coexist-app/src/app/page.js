"use client"

import { Button, ThemeProvider, CssBaseline, Box, Stack } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { darkTheme } from "../theme/themes"

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Box height="90vh" display="flex" justifyContent="center" alignItems="center">
        <Stack spacing={2}>
          <Image src="/largeSucculentLogo.png" width={225} height={225} alt="placeholder logo"></Image>
          <Box display="flex" justifyContent="center"><Link href="/login"><Button variant="contained">Login</Button></Link></Box>
          <Box display="flex" justifyContent="center"><Link href="/sign_up"><Button variant="contained">Sign Up</Button></Link></Box>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}
