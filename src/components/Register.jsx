import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
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
const Register = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const [user, setUser] = useState({
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const toast = useToast();
    let navigate = useNavigate();



    const handelChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        })
    }

    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const submit = async () => {

        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('username', user.username);
        formData.append('password', user.password);
        formData.append('confirmPassword', user.confirmPassword);
        formData.append('photo', file);

        try {
            const response = await axios.post('/api/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Registration successful', response.data);
            toast({
                title: 'Account created.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            localStorage.setItem("token",JSON.stringify(response.data));
            return navigate("/chat");
        } catch (error) {
            console.error('Registration error', error);
        }
    }
    return (
        <>
            <FormControl isRequired mb="2">
                <FormLabel>Name</FormLabel>
                <Input placeholder='Name' mb="2" name="name" onChange={handelChange} />
            </FormControl>
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
            <FormControl isRequired mb="2">
                <FormLabel>Confirm Password</FormLabel>
                <Input type="password" placeholder='Confirm Password' name="confirmPassword" mb="2" onChange={handelChange} />
            </FormControl>
            <FormControl isRequired mb="2">
                <FormLabel>Confirm Password</FormLabel>
                <Input type="file" id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange} placeholder='Confirm Password' mb="2" />
            </FormControl>
            <FormControl>
                <Button colorScheme='blue' onClick={submit} w="100%" >
                    Register
                </Button>
            </FormControl>
        </>

    )
}

export default Register