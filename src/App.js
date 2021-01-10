import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { FormControl, Input } from '@material-ui/core'
import Message from './Message';
import axios from './axios';
import FlipMove from 'react-flip-move'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import Pusher from "pusher-js"
import chatLogo from "./chat.gif"
function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')


  useEffect(() => {
    const sync = async () => {
      await axios.get("/retrieve/messages")
        .then((res, req) => {
          console.log(res.data);
          setMessages(res.data);
        })
    }
    sync();
  }, [])

  useEffect(() => {
    setUsername(prompt('Please enter your name'))
  }, [])

  useEffect(() => {
    var pusher = new Pusher('a6c7cc7a189a946d1d3f', {
      cluster: 'ap2'
    });

    var channel = pusher.subscribe('messages');
    channel.bind('inserted', function (data) {
      //alert(JSON.stringify(data));
      setMessages([...messages, data]);//sync()
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    axios.post("/save/messages", {
      username: username,
      message: input,
      timestamp: Date.now()
    })
    setInput('')
  }

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  return (
    <div className="App">

      <img src={chatLogo} alt="messenger logo" />
      <h2 className="wel">Welcome {username}</h2>
     
      
        <form className='app__form' >
          <FormControl className='app__formControl' >
            <Input className='app__input' placeholder='Enter a message...' value={input} onChange={(e) => setInput(e.target.value)} />
            <IconButton className='app__iconButton' variant='text' color='primary' disabled={!input} onClick={sendMessage} type="submit" >
              <SendIcon />
            </IconButton>
          </FormControl>
        </form>
      

      <div className="msgDiv">
        <FlipMove>
          {
            messages.map((message) => (
              <Message key={message._id} message={message} username={username} />
            ))
          }
        </FlipMove>
        <div ref={messagesEndRef} />
      </div>




    </div>
  );
}

export default App;
