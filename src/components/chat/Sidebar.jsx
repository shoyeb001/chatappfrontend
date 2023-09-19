import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import url from '../../config';
import { Box, Stack, Text, useToast, Button } from '@chakra-ui/react';
import axios from 'axios';
import { getSender } from '../../config/chatlogic';
import { useEffect } from 'react';
import LoadChat from './LoadChat';
import { BiAlarmAdd } from "react-icons/bi"
import GroupChatModal from './modals/GroupChatModal';

const Sidebar = ({fetchAgain}) => {
  const { user, chats, setChats, setSelectedChats, selectedChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const headers = {
        Authorization: `Bearer ${token.access_token}`,
      }
      const chat = await axios.get(`${url}/chat/fetch`, { headers });
      setChats(chat.data);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Some error occured',
        status: 'error',
        duration: 1500,
        isClosable: true,
      })
    }
  }

  const selectChat = (chat) =>{
    setSelectedChats(chat)

  }

  useEffect(() => {
    fetchChats();
  },[fetchAgain]);

  return (
    <>
      <Box display={{ base: selectedChats ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px" h="90vh">
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          d="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >

          My Chats
          <GroupChatModal>
            <Button
              d="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<BiAlarmAdd />}
              ml={2}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
          <Box
            d="flex"
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {
              chats ? (
                <Stack overflowY="scroll">
                  {
                    Array.isArray(chats) && chats?.map((chat) => (
                      <Box onClick={() => selectChat(chat)}
                        cursor={'pointer'}
                        background={selectedChats === chat ? "#50c9c5" : "#E8E8E8"}
                        color={selectedChats === chat ? "white" : "black"}
                        px={3}
                        py={2}
                        borderRadius={'lg'}
                        key={chat._id}
                        >
                        <Text fontSize={'sm'}>
                          {!chat.isGroupChat
                            ? getSender(user, chat.users)
                            : chat.chatName}
                        </Text>
                      </Box>
                    ))
                  }
                </Stack>
              ) : (
                <>
                  fghfghfg
                  <LoadChat />

                </>
              )
            }
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Sidebar