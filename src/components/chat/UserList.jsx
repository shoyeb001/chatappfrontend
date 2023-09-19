import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserList = ({user, handelAccess}) => {
    console.log(user);
    return (
        <>
            <Box onClick={handelAccess} cursor={'pointer'} bg="#E8E8E8" _hover={{ background: "#38B2AC", color: "white" }} w="100%" display={'flex'} alignItems={'center'} color="black" px={3} mb={2} py={2} borderRadius={'lg'}>
                <Avatar mr={2} size={'sm'} cursor={'pointer'} name={user?.name} src={`http://localhost:5000//${user?.img}`}/>
                <Box>
                    <Text>{user?.name}</Text>
                    <Text fontSize="xs">
                        <b>Username:</b>
                        {user?.username}
                    </Text>
                </Box>
            </Box>
        </>
    )
}

export default UserList