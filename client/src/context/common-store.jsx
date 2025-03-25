import { createContext, useEffect, useState } from "react";
import { auth } from "../service/apis";
import { apiConnector } from "../service/api-connector";

// 1. create
export const AppContext = createContext();

// 2. Provider
const ContextProvider = (props) => {
  // -------------------------------------- State -----------------------------------------------------
  const [token, setToken] = useState(localStorage.getItem("tokenBytical"));
  const [selectChat, setSelectedChat] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    setUser(storedUser?.value);
  }, [token]);

  //--------------------------- definition of storeTokenInLS -----------------------------------------
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("tokenBytical", serverToken);
  };

  //--------------------------- definition of set logged in data in ls ---------------------------------------
  const userDataInLs = (value) => {
    localStorage.setItem("userData", JSON.stringify({ value }));
  };

  const selectChatValue = (value) => {
    setSelectedChat(value);
  };

  // -------------------------------------------------- bundle -------------------------------------
  const contextValue = {
    storeTokenInLS,
    selectChatValue,
    setToken,
    userDataInLs,
    setUser,
    token,
    selectChat,
    user,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
