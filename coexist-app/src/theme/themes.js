"use client"

import {createTheme} from "@mui/material/styles"

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            light: "#9cca97",
            main: "#ffda3e",
            dark: "#619158"
        },
        background: {
            paper: "#456040",
            default: "#456040",
        },
    },
})
