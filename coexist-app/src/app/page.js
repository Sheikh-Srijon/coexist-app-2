"use client"

import { useContext } from "react"
import { Button, Box, Stack } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { ThemeContext } from "./layout"

export default function LandingPage() {
  const currentTheme = useContext(ThemeContext)

  return (
    <Box minHeight="90vh" display="flex" justifyContent="center" alignItems="center">
      <Stack spacing={3} direction="column" justifyContent="center" alignItems="center">
        <Image priority className="focusLogo" src={currentTheme === "lightTheme" ? "/coexistLogoLight.png" : "/coexistLogoDark.png"} width={280} height={154.5} alt="placeholder logo"></Image>
        <Link href="/login"><Button variant="contained" size="large">Login</Button></Link>
        <Link href="/sign_up"><Button variant="contained" size="large">Sign Up</Button></Link>
      </Stack>
    </Box>
  )
}
