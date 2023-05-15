"use client"

import { createContext, useState, useCallback, useEffect } from "react"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { darkTheme, lightTheme } from "@/theme/themes"
import "./globals.css"
import { useRouter } from "next/navigation"

export const ThemeContext = createContext(null)

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

function useTheme(){
  const [theme, setTheme] = useState("lightTheme")

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("darkTheme")
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const colorScheme = event.matches ? "darkTheme" : "lightTheme"
      setTheme(colorScheme)
    })
  }, [])

  return theme
}

export default function RootLayout({ children }) {
  const currentAuth = useAuth()
  const currentTheme = useTheme()

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
