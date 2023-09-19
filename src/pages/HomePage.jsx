import React,{useEffect} from 'react'
import { Container, Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import Login from '../components/Login'
import Register from '../components/Register'
import "../styles/HomePage.css"
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  let navigate = useNavigate();
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if(token){
      return navigate("/chat");
    }
  }, [navigate]);
  
  return (
    <>
      <Container minW='md' centerContent>
      <Box w='100%' bg="white" p={4} borderRadius="lg" borderWidth="1px" mb='2'>
          <h2 className='title'>Welcome to ChatAP!</h2>
        </Box>
        <Box w='100%' bg="white" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs variant='soft-rounded'>
            <TabList>
              <Tab color="black.100" w="50%">Login</Tab>
              <Tab  color="black.100" w="50%">Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login/>
              </TabPanel>
              <TabPanel>
                <Register/>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  )
}

export default HomePage