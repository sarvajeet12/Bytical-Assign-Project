import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiConnector } from "../service/api-connector";
import { auth } from "../service/apis";
import { toast } from "react-toastify";
import { AppContext } from "../context/common-store";

const Login = () => {
  const { storeTokenInLS, userDataInLs } = useContext(AppContext);
  const navigate = useNavigate();

  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });

  // TODO : ------------------------------------- handle input ----------------------------------------------
  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUserLogin({
      ...userLogin,
      [name]: value,
    });
  };

  // ---------------------------------------verify email  -------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(userLogin);
    const loadingToastId = toast.loading("Submitting data...");
    try {
      const response = await apiConnector("POST", auth.LOGIN_API, {
        email: userLogin.email,
        password: userLogin.password,
      });

      if (!response.data.success) {
        alert(response.data.message);
      } else {
        storeTokenInLS(response.data.token);
        userDataInLs(response.data.response);

        console.log("logged in user data response", response.data.response);

        toast.update(loadingToastId, {
          render: "Login Successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
        setUserLogin({
          email: "",
          password: "",
        });

        navigate("/chat-area");
      }
    } catch (error) {
      console.log("logIn  error response : ", error);
      toast.update(loadingToastId, {
        render: error.response.data.extraDetails
          ? error.response.data.extraDetails
          : error.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <h1>Login</h1>
        <form action="" onSubmit={(e) => handleLogin(e)}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email "
            required
            value={userLogin.email}
            onChange={(e) => handleInput(e)}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password "
            required
            value={userLogin.password}
            onChange={(e) => handleInput(e)}
          />
          <button type="submit">Login</button>
        </form>
        <p className="alreadyAccount">
          Not register ? <Link to={"/signup"}>Signup</Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
