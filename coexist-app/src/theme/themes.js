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
            paper: "#05043c",
            default: "#05043c",
        },
    },
})

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            light: "#fef9ff",
            main: "#d8d4de",
            dark: "#a7a2ad"
        },
        secondary: {
            light: "#ededed",
            main: "#9f8e86",
            dark: "#795c4f",
        },
        background: {
            paper: "#f4effb",
            default: "#f4effb",
        },
    },
})
