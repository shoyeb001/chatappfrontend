import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    InputGroup,
    InputRightElement,
    useToast
} from '@chakra-ui/react'
const Login = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const {user, setUser} = ChatState();


    const [luser, setLuser] = useState({
        username: "",
        password: ""
    });

    const toast = useToast();
    let navigate = useNavigate();


    const handelChange = (e) => {
        const { name, value } = e.target;
        setLuser({
            ...luser,
            [name]: value
        })
    }
    const submit = async () => {
        try {
            const response = await axios.post("/api/login", luser);
            console.log(response);
            toast({
                title: 'You logged in successfully',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            localStorage.setItem("token", JSON.stringify(response.data));
            // const fetchUser = async () => {
            //     const token = JSON.parse(localStorage.getItem("token"));
            //     if (!token) {
            //         return navigate("/");
            //     }
            //     const headers = {
            //         Authorization: `Bearer ${token.access_token}`,
            //     };
            //     const userInfo = await axios.get("/api/user/view", { headers });
            //     setUser(userInfo.data);
            //     console.log(userInfo.data);
            //     console.log(user, "chatuser");

            // }
            // fetchUser();
            return navigate("/chat");
        } catch (error) {
            console.log(error);
            toast({
                title: error.response.data.msg,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }

    }
    return (
        <>
            <FormControl isRequired mb="2">
                <FormLabel>Username</FormLabel>
                <Input placeholder='Username' mb="2" name="username" onChange={handelChange} />
            </FormControl>
            <FormControl isRequired mb="2">
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter password'
                        name="password"
                        onChange={handelChange}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <Button colorScheme='blue' onClick={submit} w="100%" >
                    Login
                </Button>
            </FormControl>
        </>
    )
}

export default Login