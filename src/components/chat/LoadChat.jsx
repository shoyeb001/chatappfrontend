import React from 'react'
import { Skeleton, Stack } from '@chakra-ui/react'

const LoadChat = () => {
    return (
        <>
            <Stack>
                {
                    [...Array(10)].map((_,i)=>(
                        <Skeleton height='50px' key={i}/>
                    ))
                }
            </Stack>
        </>
    )
}

export default LoadChat