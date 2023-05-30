"use client" 

import { useState, useContext, useEffect } from "react" 
import { Button, Grid, Paper, Typography, Box, TextField, MenuItem, Divider, CircularProgress, Alert, AlertTitle, Fade } from "@mui/material" 
import { Send, Schedule } from "@mui/icons-material"
import { AuthContext } from "@/app/layout"
import { ViewContext } from "../../layout"
import { useRouter } from "next/navigation"
import "./user.css"
import axios from "axios"

export default function Chat({ params }) {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const view = useContext(ViewContext)
  const [message, setMessage] = useState("") 
  const [messageQueue, setMessageQueue] = useState([])
  const [fetchedMessages, setFetchMessages] = useState([])
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
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
    axios.post("/api/message/post_message", messageObj).then(res => {
      setMessageQueue((prevQueue) => [...prevQueue, messageObj]) 
      setMessage("") 
      setShowSuccess(true)
    }).catch(err => {
        // TODO: add more thorough error checking
        console.log(`The follow error has occurred and as a result the message has not sent: ${err}`)
        setShowError(true)
    })
  } 

  const handleScheduleMessageDelivery = () => {
    // TODO: No real functionality for scheduling messages
  } 

  useEffect(() => {
    if(auth.auth === null){
      router.push("/")
    }
    // update view to display name of the current chat recipient
    view.changeView(params.user) // TODO: replace this with dynamic user name

    // create message data request to MongoDB endpoint
    const messageData = {
      sender: senderEmail,
      recipient: recipientEmail,
    }

    // grab the documents/messages that match the messageData req query
    axios.post("/api/message/get_messages", messageData).then(res => {
      console.log(res.data)
      setFetchMessages(res.data)
    }).catch(err => {
        // TODO: add more thorough error checking
        console.log(`The follow error has occurred and as a result the messages are not fetched: ${err}`)
    })
  }, [])

  return (
    auth.auth === null ?
    <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress color="success"/>
    </Box> 
    :
    <Box>
      <Fade in={showError} timeout={500} addEndListener={() => {
        setTimeout(() => setShowError(false), 5000)
      }}>
        <Alert id="errorAlert" severity="error" 
          sx={{top: "1rem", marginX: "1rem", position: "absolute", zIndex: (theme) => theme.zIndex.drawer + 1}}
          onClose={() => {setShowError(false)}}
        >
          <AlertTitle>Error</AlertTitle>
          Message has <strong>not</strong> been added to your scheduled send!
        </Alert>
      </Fade>
      <Fade in={showSuccess} timeout={500} addEndListener={() => {
        setTimeout(() => setShowSuccess(false), 5000)
      }}>
        <Alert id="successAlert" severity="success" 
          sx={{top: "1rem", marginX: "1rem", position: "absolute", zIndex: (theme) => theme.zIndex.drawer + 1}}
          onClose={() => {setShowSuccess(false)}}
        >
          <AlertTitle>Success</AlertTitle>
          Message added to your scheduled send!
        </Alert>
      </Fade>
      <Box sx={{
        mt: {xs: "15vh", md: "10vh", xl: "5vh"},
        ml: {xs: "0vh", sm: "25vw", md: "20vw"},
        px: {xs: "10px", sm: "15px", md: "20px"}
        }}>
          <Grid container spacing={2} my="25px">
          <Grid item xs={12}>
              <Paper variant="outlined" sx={{ 
                height: "60vh",
                overflowY: "auto",
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
                  sx={{m: 2}}
              />
              <Button
                  className="wide-button"
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  sx={{m: 2}}
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
                  sx={{m: 2}}
              >
                  <MenuItem value="">Select a time</MenuItem>
              </TextField>
              <Button
                  className="wide-button"
                  variant="contained"
                  endIcon={<Schedule />}
                  onClick={handleScheduleMessageDelivery}
                  disabled
                  sx={{m: 2}}
              >
                  Schedule Message Delivery
              </Button>
              </Paper>
          </Grid>
          </Grid>
      </Box>
    </Box>
  ) 
}
