"use client" 

import { useState, useContext, useEffect } from "react" 
import { Button, Grid, Paper, Typography, Box, TextField, MenuItem, Divider, CircularProgress } from "@mui/material" 
import { Send, Schedule, ArrowBackIosNew } from "@mui/icons-material"
import { AuthContext } from "@/app/layout"
import { useRouter } from "next/navigation"
import "./user.css"
import axios from "axios"

export default function Chat({ params }) {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const [message, setMessage] = useState("") 
  const [messageQueue, setMessageQueue] = useState([])
  const [fetchedMessages, setFetchMessages] = useState([])
  // determine who is the and recipient
  const senderEmail = auth.auth.email
  const recipientEmail = params.user // TODO: update with real recipient email

  const handleSendMessage = () => {
    // message for database information
    const messageObj = {
      sender: senderEmail,
      recipient: recipientEmail,
      message,
      timestamp: new Date().toLocaleTimeString(),
      send_time: "no time" // TODO: come back to fix this for scheduling
    } 

    // post to the database and update UI
    axios.post("/api/chat/post_message", messageObj).then(res => {
      setMessageQueue((prevQueue) => [...prevQueue, messageObj]) 
      setMessage("") 
    }).catch(err => {
        // TODO: add more thorough error checking
        console.log(`The follow error has occurred and as a result the message has not sent: ${err}`)
    })
  } 

  const handleScheduleMessageDelivery = () => {
    // TODO: No real functionality for scheduling messages
  } 

  useEffect(() => {
    if(auth.auth === null){
      router.push("/")
    }

    // create chat data request to MongoDB endpoint
    const chatData = {
      sender: senderEmail,
      recipient: recipientEmail,
    }

    // grab the documents/messages that match the chatData req query
    axios.post("/api/chat/get_messages", chatData).then(res => {
      console.log(res.data)
      setFetchMessages(res.data)
    }).catch(err => {
        // TODO: add more thorough error checking
        console.log(`The follow error has occurred and as a result the messages are not fetched: ${err}`)
    })
  }, [])

  // fetch messages on load
  useEffect(() => {
      // create chat data request to MongoDB endpoint
      const chatData = {
        sender: senderEmail,
        recipient: recipientEmail,
      }

      // grab the documents/messages that match the chatData req query
      axios.post("/api/chat/get_messages", chatData).then(res => {
        console.log(res.data)
        setFetchMessages(res.data)
      }).catch(err => {
          // TODO: add more thorough error checking
          console.log(`The follow error has occurred and as a result the messages are not fetched: ${err}`)
      })
    },[])

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
                <Typography variant="h4">
                {params.user}
                </Typography>
            </Box>
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <Paper variant="outlined" sx={{ 
              height: "60vh",
              overflowY: "scroll",
              overscrollBehaviorY: "contain"
            }}>
            <Divider />
            {/* Display fetched messages */}
            {fetchedMessages.map((msg, index) => (
                <Box key={index} p={2}  sx={{
                  textAlign: msg.sender === senderEmail ? 'right' : 'left',
                  pl: msg.sender === senderEmail ? {xs: "15%", sm: "20%", md: "35%", lg: "40%"} : 1,
                  pr: msg.sender === senderEmail ? 1 : {xs: "15%", sm: "20%", md: "35%", lg: "40%"},
                }} >
                  <Typography onClick={() => {
                    const ts = document.getElementById(`${index}ts`)
                    ts.classList.toggle("hidden-element")
                  }}>
                      <b>{msg.sender}:</b> {msg.message}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" id={`${index}ts`} className="hidden-element">
                      {msg.timestamp}
                  </Typography>
                </Box>
            ))}
            {/* Display scheduled messages */}
            {messageQueue.map((msg, index) => (
                <Box key={index} p={2} sx={{
                  textAlign: "right",
                  pl: {xs: "15%", sm: "20%", md: "35%", lg: "40%"},
                  pr: 1
                }}>
                    <Typography onClick={() => {
                      const ts = document.getElementById(`${index}ts`)
                      ts.classList.toggle("hidden-element")
                    }}>
                      <b>Scheduled:</b> {msg.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" id={`${index}ts`} className="hidden-element">
                      {msg.timestamp}
                    </Typography>
                </Box>
                ))}
            </Paper>
        </Grid>
        <Grid item xs={12}>
            <Paper variant="outlined" sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <TextField
                fullWidth
                multiline
                maxRows={4}
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