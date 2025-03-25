import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Conversation from "../components/conversation";
import { io } from "socket.io-client";
import { AppContext } from "../context/common-store";
import { useNavigate } from "react-router-dom";

const ChatArea = () => {
  const { user, token } = useContext(AppContext);

  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const newSocket = io("https://bytical-assign-project.onrender.com"); // Connect to the backend
    setSocket(newSocket);

    // Emit the userId to the server
    if (user && user._id) {
      newSocket.emit("AddUserSocket", user._id);
    }

    // Cleanup on component unmount
    return () => newSocket.close();
  }, [user]);

  return (
    <div className="chatArea">
      <Sidebar />
      <Conversation socket={socket} />
    </div>
  );
};

export default ChatArea;
