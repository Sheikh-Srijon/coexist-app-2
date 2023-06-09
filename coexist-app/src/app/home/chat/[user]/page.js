"use client" 

import { useState, useContext, useEffect } from "react" 
import { Button, Typography, Box, TextField, Divider, CircularProgress, Alert, AlertTitle, Fade } from "@mui/material" 
import { Send } from "@mui/icons-material"
import { AuthContext } from "@/app/layout"
import { ViewContext } from "../../layout"
import { useRouter } from "next/navigation"
import "./user.css"
import axios from "axios"

export default function Chat({ searchParams }) {
  const router = useRouter()
  const auth = useContext(AuthContext)
  const view = useContext(ViewContext)
  const [message, setMessage] = useState("") 
  const [messageQueue, setMessageQueue] = useState([])
  const [fetchedMessages, setFetchedMessages] = useState([])
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // determine who is the and recipient
  const senderEmail = auth.auth.email
  const recipientEmail = searchParams.email

  const handleSendMessage = (e) => {
    // message for database information
    const send = new Date()
    send.setUTCHours(1, 0, 0, 0)
    
    const messageObj = {
      sender: senderEmail,
      recipient: recipientEmail,
      message,
      timestamp: new Date().toLocaleTimeString(),
      send_time: send.toLocaleTimeString(), // this is for 1pm PST since we can currently only do 1 cron job a day
      chat_id: searchParams.chat_id,
    } 

    // post to the database and update UI
    axios.post("/api/message/post_message", messageObj).then(res => {
      setMessageQueue((prevQueue) => [...prevQueue, messageObj]) 
      setMessage("") 
      setShowSuccess(true)
      setShowError(false)
      
      document.getElementById("emptyChatAlert").classList.add("hidden-element")

      const lastMessage = document.getElementById(`${messageQueue.length - 1}qMsg`)
      if(lastMessage !== null){
        lastMessage.scrollIntoView(false)
      }
    }).catch(err => {
        console.log(err)
        setShowError(true)
        setShowSuccess(false)
    })

    e.preventDefault()
  }

  useEffect(() => {
    if(auth.auth === null){
      router.push("/")
    }
    // update view to display name of the current chat recipient
    view.changeView(`${searchParams.first} ${searchParams.last}`)

    // create message data request to MongoDB endpoint
    const messageData = {
      sender: senderEmail,
      chat_id: searchParams.chat_id
    }

    // grab the documents/messages that match the messageData req query
    axios.post("/api/message/get_messages", messageData).then(res => {
        setFetchedMessages(res.data.messages)
        setMessageQueue(res.data.queued_messages)

        if (res.data.messages.length + res.data.queued_messages.length === 0){
          document.getElementById("emptyChatAlert").classList.remove("hidden-element")
        }
        
        if (res.data.queued_messages.length !== 0){
          document.getElementById(`${messageQueue.length - 1}qMsg`).scrollIntoView(false)
        }
        else if (res.data.messages.length !== 0){
          document.getElementById(`${fetchedMessages.length - 1}Msg`).scrollIntoView(false)
        }
    }).catch(err => {
        console.log(err)
    })
  }, [])

  return (
    auth.auth === null ?
    <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
      <CircularProgress color="success"/>
    </Box> 
    :
    <Box>
      <Fade in={showError} timeout={300} addEndListener={() => {
        setTimeout(() => setShowError(false), 3000)
      }}>
        <Alert severity="error" 
          sx={{top: "1rem", marginX: "1rem", position: "fixed", zIndex: (theme) => theme.zIndex.drawer + 1}}
          onClose={() => {setShowError(false)}}
        >
          <AlertTitle>Error</AlertTitle>
          Message has <strong>not</strong> been added to your scheduled send!
        </Alert>
      </Fade>
      <Fade in={showSuccess} timeout={300} addEndListener={() => {
        setTimeout(() => setShowSuccess(false), 3000)
      }}>
        <Alert severity="success" 
          sx={{top: "1rem", marginX: "1rem", position: "fixed", zIndex: (theme) => theme.zIndex.drawer + 1}}
          onClose={() => {setShowSuccess(false)}}
        >
          <AlertTitle>Success</AlertTitle>
          Message added to your scheduled send!
        </Alert>
      </Fade>
      <Box sx={{
        ml: {xs: "0vw", sm: "25vw", md: "20vw"}
      }}>
          <Box sx={{
            height: {xs: "calc(100vh - 48px)", sm: "calc(100vh - 64px)"},
            mt: {xs: "48px", sm: "64px"},
            display: "flex",
            flexDirection: "column"
          }}>
            <Box sx={{ 
                  overflowY: "auto",
                  overscrollBehaviorY: "contain",
                  flexGrow: 1
                }}>
                {/* Display a message if no messages exist in this chat */}
                <Typography className="hidden-element" id="emptyChatAlert" sx={{
                  opacity: 0.6,
                  fontSize: "1.4rem",
                  textAlign: "center",
                  mt: {xs: "56px", sm: "72px"}
                }}>
                  It is empty in here... trying adding a message below!
                </Typography>
                {/* Display fetched messages */}
                {fetchedMessages.map((msg, index) => (
                    <Box id={`${index}Msg`} key={index} p={2}  sx={{
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
                {messageQueue.length > 0 ? <Divider sx={{mt: "10px"}}>Scheduled Messages</Divider> : ""}
                {/* Display scheduled messages */}
                {messageQueue.map((msg, index) => (
                    <Box id={`${index}qMsg`} key={index} p={2} sx={{
                      textAlign: "right",
                      pl: {xs: "15%", sm: "20%", md: "35%", lg: "40%"},
                      pr: 1
                    }}>
                        <Typography onClick={() => {
                          const ts = document.getElementById(`${index}qTs`)
                          ts.classList.toggle("hidden-element")
                        }}>
                          <b>Scheduled:</b> {msg.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" id={`${index}qTs`} className="hidden-element">
                          {msg.timestamp}
                        </Typography>
                    </Box>
                  ))}
            </Box>
            <Box component="form" autoComplete="off" noValidate onSubmit={e => handleSendMessage(e)} sx={{ 
              display: "flex", 
              alignItems: "center", 
              p: 1, 
              width: {xs: "100vw", sm: "75vw", md: "80vw"},
              bgcolor: "background.paper",
              justifySelf: "end"
            }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    label="Type a message"
                    sx={{m: 1}}
                />
                <Button
                    variant="contained"
                    type="submit" 
                    endIcon={<Send />}
                    disabled={!message.trim()}
                    sx={{m: 1, minWidth: "8rem", height: "3.65rem"}}
                >
                    Send
                </Button>
            </Box>
          </Box>
      </Box>
    </Box>
  ) 
}
