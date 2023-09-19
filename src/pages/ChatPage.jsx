import React, { useState } from 'react'
import Header from '../components/chat/Header';
import Sidebar from '../components/chat/Sidebar';
import Chats from '../components/chat/Chats';
import { Box } from '@chakra-ui/react';
import "../styles/ChatPage.css"
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <>
      <div className='chat' style={{ width: "100%" }}>

        <Header />
        <Box className='main'>
          <Sidebar w="30%" fetchAgain={fetchAgain} />
          <Chats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} w="60%"/>
        </Box>
      </div>

    </>
  )
}

export default ChatPage