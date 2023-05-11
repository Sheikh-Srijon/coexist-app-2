"use client"

import {createTheme} from "@mui/material/styles"

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            light: "#e8e3ef",
            main: "#3e188e",
            dark: "#230a7e"
        },
        secondary: {
            light: "#9f8e86",
            main: "#6d5347",
            dark: "#4e3a34",
        },
        background: {
            paper: "#030071",
            default: "#030071",
        },
    },
})
