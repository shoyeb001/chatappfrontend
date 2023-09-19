import {
    Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Portal, MenuItem, Avatar, MenuDivider,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    DrawerCloseButton,
    Input,
    useToast
} from '@chakra-ui/react'
import ProfileModal from './ProfileModal'
import { AiOutlineSearch, AiOutlineBell } from "react-icons/ai"
import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LoadChat from './LoadChat'
import axios from 'axios'
import UserList from './UserList'

const Header = () => {
    const { user, setChats, chats, notification, setNotification } = ChatState();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false);
    const [chatUsers, setChatusers] = useState();
    const toast = useToast();
    const url = process.env.REACT_APP_API_URL;

    const handelSearch = async () => {
        if (!search) {
            toast({
                title: 'Enter something in search',
                status: 'warning',
                duration: 1500,
                isClosable: true,
            })
        } else {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem("token"));
            const headers = {
                Authorization: `Bearer ${token.access_token}`,
            }
            try {
                const users = await axios.get(`${url}/user/search?username=${search}`, { headers });
                console.log(users);
                setChatusers(users.data);
                setLoading(false);

            } catch (error) {

                toast({
                    title: 'Some error occured',
                    status: 'error',
                    duration: 1500,
                    isClosable: true,
                })
                setLoading(false);
            }
        }
    }


    const logout = () => {
        localStorage.removeItem("token");
        return navigate("/");
    }

    const accessChat = async(userId) => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem("token"));
            const headers = {
                "Content_type":"application/json",
                Authorization: `Bearer ${token.access_token}`,
            }
            const createChat = await axios.post(`${url}/chat/get`,{userId:userId}, {headers});
            if(chats!==undefined && !chats.find((c)=>c._id===createChat.data._id)) setChats([createChat.data], ...chats);
            setChats(createChat.data);
            setLoading(false);
            console.log(createChat);
            onClose();
        } catch (error) {
            console.log(error);

            toast({
                title: 'Some error occured',
                status: 'error',
                duration: 1500,
                isClosable: true,
            })
            setLoading(false);
        }
    }

    return (
        <>
            <Box display="flex" justifyContent="space-between" w='100%' bg="white" pt='15px' pb='15px' pl="10px" pr="10px">
                <Tooltip hasArrow label="search users">
                    <Button leftIcon={<AiOutlineSearch />} onClick={onOpen} colorScheme='teal' size="sm" variant='ghost' px='4'>
                        Search Users
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontWeight="600" color="#50c9c5">MyChat</Text>
                <div>
                    <Menu>
                        <MenuButton as={Button} variant={'unstyled'}><AiOutlineBell style={{ fontSize: "20px" }} /></MenuButton>
                        <Portal>
                            <MenuList>
                                <MenuItem>New Message from shoyeb</MenuItem>
                                <MenuItem>New Message from shoyeb</MenuItem>
                                <MenuItem>New Message from shoyeb</MenuItem>
                                <MenuItem>New Message from shoyeb</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                    <Menu>
                        <MenuButton><Avatar name='Dan Abrahmov' size="sm" src={`http://localhost:5000//${user?.img}`} /></MenuButton>
                        <Portal>
                            <MenuList>
                                <ProfileModal user={user}>
                                    <MenuItem>View Profile</MenuItem>
                                </ProfileModal>
                                <MenuDivider />
                                <MenuItem onClick={logout}>Logout</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </div>

            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search Users</DrawerHeader>

                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input placeholder='Search by username' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button colorScheme='blue' onClick={handelSearch}>Go</Button>
                        </Box>
                        {loading ? (<LoadChat />) : (<>
                            {
                                chatUsers?.map((item) => (
                                    <UserList key={item._id} user={item} handelAccess={() => accessChat(item._id)} />
                                ))
                            }
                        </>)}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
}

export default Header