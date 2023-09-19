import React, { useState } from 'react'
import { AiFillEye } from "react-icons/ai"
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
    IconButton,
    Spinner,
} from "@chakra-ui/react";
import { ChatState } from '../../../context/ChatProvider';
import url from '../../../config';
import UserBadgeItem from '../../user/UserBadgeItem';
import UserList from '../UserList';

const UpdateGroupchatModal = ({ setFetchAgain, fetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();

    const { user, selectedChats, setSelectedChats } = ChatState();
    const token = JSON.parse(localStorage.getItem("token"));

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const headers = {
                Authorization: `Bearer ${token.access_token}`
            }
            const { data } = await axios.put(`${url}/groupchat/rename`, {
                chatId: selectedChats._id,
                chatName: groupChatName
            }, { headers });
            console.log(data);

            setSelectedChats(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    }

    const handelSearch = async (query) => {
        setSearch(query);
        if (!query) return;
        try {
            setLoading(true);
            const headers = {
                Authorization: `Bearer ${token.access_token}`
            }
            const { data } = await axios.get(`${url}/user/search?username=${query}`, { headers });
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    }

    const handleRemove = async(item) => {
        // if(selectedChats.groupAdmin._id!==user._id && item._id!==user._id){
        //     toast({
        //         title: "Only admins can remove someone!",
        //         status: "error",
        //         duration: 5000,
        //         isClosable: true,
        //         position: "bottom",
        //       });
        //       return;
        // }

    }

    const handelAddUser = async (item) => {
        if (selectedChats.users.find((u) => u._id === item._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChats.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const headers = {
                Authorization: `Bearer ${token.access_token}`
            }
            const { data } = await axios.put(`${url}/groupchat/add`, {
                chatId: selectedChats._id,
                userId: item._id
            }, { headers });
            setSelectedChats(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setSearch("");
    }

    return (
        <>
            <IconButton d={{ base: "flex" }} icon={<AiFillEye />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="35px"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent="center">{selectedChats.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                            {selectedChats.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    admin={selectedChats.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl d="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >update</Button>
                        </FormControl>
                        <FormControl mt={2}>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                onChange={(e) => handelSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user) => (
                                <UserList
                                    key={user._id}
                                    user={user}
                                    handelAccess={() => handelAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupchatModal