"use client" 

import { useState, useContext, useEffect } from "react" 
import { Button, Grid, Paper, Typography, Box, TextField, MenuItem, Divider } from "@mui/material" 
import { Send, Schedule, CircularProgress, ArrowBackIosNew } from "@mui/icons-material"
import { AuthContext } from "@/app/layout"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Chat({ params }) {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const [message, setMessage] = useState("") 
  const [messageQueue, setMessageQueue] = useState([]) 

  const dummyMessages = [
    {
      sender: params.user,
      message: "Hello!",
      timestamp: "9:00 AM",
    },
    {
      sender: "You",
      message: "Hi! How are you?",
      timestamp: "9:01 AM",
    },
    {
      sender: params.user,
      message: "I’m good, thanks! How about you?",
      timestamp: "9:02 AM",
    },
    {
      sender: "You",
      message: "I’m doing great!",
      timestamp: "9:03 AM",
    },
    {
      sender: params.user,
      message: "That’s wonderful to hear!",
      timestamp: "9:04 AM",
    },
    {
      sender: params.user,
      message: "By the way, how’s your day going?",
      timestamp: "9:05 AM",
    },
  ] 

  const handleSendMessage = () => {
    const newMessage = {
      sender: "You",
      message,
      timestamp: new Date().toLocaleTimeString(),
    } 
    setMessageQueue((prevQueue) => [...prevQueue, newMessage]) 
    setMessage("") 
  } 

  const handleScheduleMessageDelivery = () => {
    // TODO: No real functionality for scheduling messages
  } 

  useEffect(() => {
    if(auth.auth === null){
      router.push("/")
    }
  }, [])

  return (
    auth.auth === null ?
    <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress color="success"/>
    </Box> 
    :
    <Box>
        <Link href="/home">
            <Button size="large" startIcon={<ArrowBackIosNew/>} className="returnButton">
                Go Back
            </Button>
        </Link>
        <Grid container spacing={2} my="25px">
        <Grid item xs={12}>
            <Paper variant="outlined">
            <Box display="flex" alignItems="center" p={2}>
                <Typography variant="h6" component="h2" sx={{ ml: 2 }}>
                {params.user}
                </Typography>
            </Box>
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <Paper variant="outlined" sx={{ minHeight: 300 }}>
            <Box p={2}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                Message Queue
                </Typography>
                {/* Display message queue */}
                {messageQueue.map((msg, index) => (
                <Box key={index} py={1}>
                    <Typography>{msg.message}</Typography>
                    <Typography variant="caption" color="textSecondary">
                    <b>Timestamp:</b> {msg.timestamp}
                    </Typography>
                </Box>
                ))}
            </Box>
            <Divider />
            {/* Display dummy messages */}
            {dummyMessages.map((msg, index) => (
                <Box key={index} p={2}>
                <Typography>
                    <b>{msg.sender}:</b> {msg.message}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    <b>Timestamp:</b> {msg.timestamp}
                </Typography>
                </Box>
            ))}
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <TextField
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                label="Type a message"
            />
            <Button
                variant="contained"
                endIcon={<Send />}
                onClick={handleSendMessage}
                disabled={!message.trim()}
            >
                Send
            </Button>
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <TextField
                select
                fullWidth
                disabled
                label="Schedule time"
            >
                <MenuItem value="">Select a time</MenuItem>
            </TextField>
            <Button
                variant="contained"
                endIcon={<Schedule />}
                onClick={handleScheduleMessageDelivery}
                disabled
            >
                Schedule Message Delivery
            </Button>
            </Paper>
        </Grid>
        </Grid>
    </Box>
  ) 
}