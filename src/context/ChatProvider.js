import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();


const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChats, setSelectedChats] = useState();
    const [chats, setChats] = useState();
    const [notification, setNotification] = useState([]);
    let navigate = useNavigate();




    useEffect(() => {

        const fetchUser = async () => {
            const token = JSON.parse(localStorage.getItem("token"));
            if (!token) {
                return navigate("/");
            }
            const headers = {
                Authorization: `Bearer ${token.access_token}`,
            };
            const userInfo = await axios.get("/api/user/view", { headers });
            setUser(userInfo.data);
            console.log(userInfo.data);
            console.log(user, "chatuser");

        }
        fetchUser();
        console.log(user,"provider");

    }, [navigate]);

    if (user === null) {
        return null; // or loading indicator
    }




    return <ChatContext.Provider value={{ user, setUser,notification, setNotification, selectedChats, setSelectedChats, chats, setChats }}>
        {children}
    </ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider; 