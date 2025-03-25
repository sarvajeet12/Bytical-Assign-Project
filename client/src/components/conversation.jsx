import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/common-store";
import { apiConnector } from "../service/api-connector";
import { chat } from "../service/apis";

const Conversation = ({ socket }) => {
  const { selectChat, user } = useContext(AppContext);

  const [messages, setMessages] = useState("");
  const [allMsg, setAllMsg] = useState([]);

  // ------------------------------------------------ socket io ---------------------------------------

  useEffect(() => {
    if (socket) {
      socket.off("receiveMessage");
      socket.on("receiveMessage", (newMessage) => {
        console.log("message from socket.io", newMessage);
        console.log("SelectedUserformsocket", selectChat._id);
        console.log("SelectedUsermessageid", newMessage.userId);
        if (newMessage.userId === selectChat?._id) {
          setAllMsg((prevMessages) => [...prevMessages, newMessage]);
        } else {
          console.log("Message not for the selected user, ignoring...");
        }
      });
    }
  }, [socket, selectChat]);

  // ----------------------------------------------- handle submit message -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const messageData = {
        senderId: user._id,
        receiverId: selectChat._id,
        message: messages,
      };

      // Emit message via Socket.IO
      socket.emit("sendMessage", { messageData });
      const UpdateMessage = {
        userId: user._id,
        message: messages,
        time: Date.now(),
      };
      setAllMsg((prevMessages) =>
        Array.isArray(prevMessages)
          ? [...prevMessages, UpdateMessage]
          : [UpdateMessage]
      );

      const response = await apiConnector("POST", chat.SEND_MSG_API, {
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        message: messageData.message,
      });

      if (!response.data.success) {
        alert(response.data.message);
      } else {
        // console.log("send msg response: ", response);
        // getAllMessage();
        setMessages("");
      }
    } catch (error) {
      console.log("send msg response : ", error.message);
    }
  };

  // ------------------------------------- get message ----------------------------------
  const getAllMessage = async () => {
    try {
      const senderData = {
        senderId: user._id,
        receiverId: selectChat._id,
      };

      const response = await apiConnector("POST", chat.GET_ALL_MSG_API, {
        senderId: senderData.senderId,
        receiverId: senderData.receiverId,
      });
      // console.log("get msg response: ", response.data.response);

      if (response.status !== 200) {
        alert(response.data.message);
      } else {
        setAllMsg(response.data.response);
      }
    } catch (error) {
      console.log("get msg response : ", error.message);
    }
  };

  useEffect(() => {
    if (user && selectChat) {
      getAllMessage();
    }
  }, [selectChat, user]);

  return (
    <div className="conversation">
      {/* ----------------------------------------- Header ---------------------------------------------- */}
      <div className="conversationHeader">
        {selectChat ? (
          <>
            <img src={selectChat?.image} alt="" />
            <span>
              <p>{selectChat?.name}</p>
              {/* <p>{selectChat?._id === user?._id ? "Online" : "Offline"}</p> */}
            </span>
          </>
        ) : null}
      </div>

      {!selectChat ? (
        <p style={{ fontSize: "2rem" }}> select User</p>
      ) : (
        <>
          {/* ----------------------------------------- Body ---------------------------------------------- */}
          <div className="conversationBody">
            <div className="messageBox">
              {allMsg?.length > 0 ? (
                <>
                  {allMsg &&
                    Array.isArray(allMsg) &&
                    allMsg.map((msg, index) => (
                      <div className={`allMsg`} key={index}>
                        {msg.message}
                      </div>
                    ))}
                </>
              ) : (
                <p>"No conversation yet"</p>
              )}
            </div>

            {/* ----------------------------------------- Input field ---------------------------------------------- */}
            <form action="" onSubmit={(e) => handleSubmit(e)}>
              <input
                type="text"
                name="message"
                onChange={(e) => setMessages(e.target.value)}
                value={messages}
              />
              <input type="submit" value="send" />
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Conversation;
