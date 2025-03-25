import React, { useContext, useEffect, useState } from "react";
import { apiConnector } from "../service/api-connector";
import { auth } from "../service/apis";
import { AppContext } from "../context/common-store";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const { token, setToken, selectedChat, selectChatValue, setUser, user } =
    useContext(AppContext);

  const [allUser, setAllUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ----------------------------------------------- get all user -----------------------------------------------------
  const getAllUserDetails = async () => {
    try {
      const response = await apiConnector("GET", auth.GET_ALL_USER, null);

      const userData = response.data.response;

      if (!response.data.success) {
        alert(response.data.message);
      } else {
        setAllUser(userData);
        // console.log("store response: ", userData);
      }
    } catch (error) {
      console.log("get all user error: ", error.message);
    }
  };

  useEffect(() => {
    getAllUserDetails();
  }, []);

  // -------------------------------------------- selected chat ----------------------------------
  const handleSelectChat = (value) => {
    selectChatValue(value);
  };

  // ----------------------------------------------- handle logout -----------------------------------
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("tokenBytical");
    localStorage.removeItem("userData");
    navigate("/");
  };

  // const filteredUsers = allUser.filter((user) =>
  //   user.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredUsers = allUser
    .filter((curUser) => curUser._id !== user._id)
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearch = (value) => {
    setSearchQuery(value); // Update the search query state
  };

  return (
    <div className="sidebar">
      <h1>Chats</h1>
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ul className="chatsPerson">
        <>
          {filteredUsers.map((user, index) => (
            <li
              key={index}
              style={{
                color: `${selectedChat?._id === user._id ? "#fff" : "#000"}`,
                fontWeight: "bold",
              }}
              onClick={() => handleSelectChat(user)}
            >
              <img src={user.image} alt={user.image} />
              <span>{user.name}</span>
            </li>
          ))}
        </>
      </ul>
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
};

export default Sidebar;
