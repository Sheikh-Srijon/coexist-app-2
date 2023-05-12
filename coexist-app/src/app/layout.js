"use client"

import { createContext, useState, useCallback } from "react"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { darkTheme, lightTheme } from "@/theme/themes"
import "./globals.css"
import { useRouter } from "next/navigation"

let theme = "lightTheme"

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  theme = "darkTheme"
}

export const ThemeContext = createContext(theme)

export const AuthContext = createContext(null)

function getAuth(){
  if(typeof window === "undefined"){
    return null
  }

  const authInfoStr = localStorage.getItem("__AUTH")
  if(authInfoStr === null){
    return null
  }

  return JSON.parse(authInfoStr)
}

function setAuth(auth){
  if(auth === null){
    localStorage.removeItem("__AUTH")
    return
  }

  localStorage.setItem("__AUTH", JSON.stringify(auth))
}

function useAuth(){
  const [auth, setAuthState] = useState(getAuth())
  const router = useRouter()

  const logIn = useCallback(async (email, password) => {
    const myNewAuth = {email: email, password: password} // await TODO: SOME FUNCTION TO LOG THE USER IN

    setAuth(myNewAuth)
    setAuthState(myNewAuth)
    router.push("/home")
  }, [setAuthState])

  const logOut = useCallback(async () => {
    // await TODO: SOME FUNCTION TO LOG THE USER OUT

    setAuth(null)
    setAuthState(null)
    router.push("/")
  },[setAuthState])

  return {auth, logIn, logOut}
}

export default function RootLayout({ children }) {
  const currentAuth = useAuth()
  const currentTheme = theme

  return (
    <html lang="en">
      <head>
        <title>Coexist</title>
        <meta name="description" content="The Coexist landing page"></meta>
      </head>
      <AuthContext.Provider value={currentAuth}>
        <ThemeContext.Provider value={currentTheme}>
          <ThemeProvider theme={currentTheme === "lightTheme" ? lightTheme : darkTheme}>
            <CssBaseline/>
            <body>{children}</body>
          </ThemeProvider>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </html>
  )
}
