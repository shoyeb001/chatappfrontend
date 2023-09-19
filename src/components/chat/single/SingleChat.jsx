import React, { useState, useEffect } from 'react'
import { ChatState } from '../../../context/ChatProvider'
import { Text, Box, IconButton, Button, FormControl, useToast, Spinner, Input } from '@chakra-ui/react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { getSender, getSenderFull } from '../../../config/chatlogic';
import ProfileModal from '../ProfileModal';
import { AiFillEye } from "react-icons/ai";
import axios from 'axios';
import url from '../../../config';
import { ScrollableChat } from './ScrollableChat';
import UpdateGroupchatModal from '../modals/UpdateGroupchatModal';
import {io} from "socket.io-client";
import "../../../styles/single.css";

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
console.log(ENDPOINT);
let socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const { user, selectedChats, setSelectedChats, notification, setNotification } = ChatState();
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [socketConnect, setSocketConnect] = useState(false);
    const toast = useToast();
    const token = JSON.parse(localStorage.getItem("token"));
    

    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage) {
            socket.emit("stop typing", selectedChats._id);
            try {
                const headers = {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token.access_token}`,
                }
                setNewMessage("");
                const { data } = await axios.post(`${url}/message/send`, {
                    content: newMessage,
                    chatId: selectedChats
                }, { headers });
                console.log(data);
                socket.emit("new message", data);
                setMessages([...messages, data]);
                setLoading(false);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Messages",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if(!socketConnect) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing", selectedChats._id);
        }
        let lastTypingTime = new Date().getTime();
        const timerLen = 3000;
        setTimeout(()=>{
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if(timeDiff>=timerLen && typing){
                socket.emit("stop typing", selectedChats._id);
                setTyping(false);
            }
        },timerLen);
        
    };

    const fetchMessages = async () =>{
        if(!selectedChats) return;

        try {
            setLoading(true);
            const headers = {
                Authorization: `Bearer ${token.access_token}`,
            }
            const {data} = await axios.get(`${url}/message/fetch/${selectedChats._id}`, {headers});
            console.log(data);

            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChats._id);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    }

    
    useEffect(()=>{
        socket = io(ENDPOINT);
        if(user){
            socket.emit("setup", user);
            socket.on("connection",()=>setSocketConnect(true));
            socket.on("typing", ()=> setIsTyping(true));
            socket.on("stop typing", ()=> setIsTyping(false));
        }
    },[user]);

    // useEffect(()=>{
    //     if(socketConnect){
    //         socket.on("typing", ()=> setIsTyping(true));
    //         socket.on("stop typing", ()=> setIsTyping(false));
    //     }
    // },["typing","stop typing" ]);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChats;
      }, [selectedChats]);

    useEffect(()=>{
       socket.on("message received", (newMsgRec)=>{
        if(!selectedChatCompare||selectedChatCompare._id !== newMsgRec.chat._id){
            if (!notification.includes(newMsgRec)) {
                setNotification([newMsgRec, ...notification]);
                setFetchAgain(!fetchAgain);
            }
        }else{
            setMessages([...messages, newMsgRec]);
        }
       })
    })


    return (
        <>
            {
                selectedChats ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >

                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<BsFillArrowLeftCircleFill />}
                                onClick={() => setSelectedChats(undefined)}
                            />
                            {
                                (!selectedChats.isGroupChat ? (
                                    <>
                                        {getSender(user, selectedChats.users)}
                                        <ProfileModal
                                            user={getSenderFull(user, selectedChats.users)}
                                        >

                                            <Button colorScheme='teal' variant='ghost'>
                                                <AiFillEye />
                                            </Button>
                                        </ProfileModal>
                                    </>
                                ) : (
                                    <>
                                        {selectedChats.chatName.toUpperCase()}
                                        <UpdateGroupchatModal fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain} />
                                    </>
                                ))}
                        </Text>
                    </>
                ) : (
                    <>
                        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                                Click on a user to start chatting
                            </Text>
                        </Box>
                    </>
                )
            }
            <Box display="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                bg="#E8E8E8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden">
                {loading ? (
                    <Spinner
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        margin="auto"
                    />
                ) : (
                    <div className="messages" >
                        <ScrollableChat messages={messages} />
                    </div>
                )}


                <FormControl
                    onKeyDown={sendMessage}
                    id="first-name"
                    isRequired
                    mt={3}
                >
                    {isTyping ? (
                        <div>
                            {/* <Lottie
                                options={defaultOptions}
                                // height={50}
                                width={70}
                                style={{ marginBottom: 15, marginLeft: 0 }}
                            /> */}
                            <img src='./typing.gif' alt='typing' style={{width:"50px"}}/>
                        </div>
                    ) : (
                        <></>
                    )}
                    <Input
                        variant="filled"
                        bg="#E0E0E0"
                        placeholder="Enter a message.."
                        value={newMessage}
                        onChange={typingHandler}
                    />
                </FormControl>
            </Box>
        </>
    )
}

export default SingleChat