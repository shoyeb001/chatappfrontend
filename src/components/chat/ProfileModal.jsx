import React from 'react'
import {useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Avatar,
    Text,
    Button,
    ModalCloseButton,} from "@chakra-ui/react"

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const server_url = process.env.REACT_APP_ENDPOINT;

  return (
    <>
    {children?(<span onClick={onOpen}>{children}</span>):(<p>None</p>)}
      <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>User Name:{user?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody textAlign={'center'}>
                        <div>
                            <Avatar name={user?.name} size="2xl" src={`${server_url}//${user?.img}`} />
                            <Text>{user?.username}</Text>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
    </>
  )
}

export default ProfileModal