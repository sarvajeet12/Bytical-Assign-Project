import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiConnector } from "../service/api-connector";
import { auth } from "../service/apis";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();

  const [userSignUpData, setUserSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // TODO : ---------------------------------------------------------- handle input ------------------------------------------------------------
  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUserSignUpData({
      ...userSignUpData,
      [name]: value,
    });
  };

  // TODO : ---------------------------------------------------------- handle submit data ------------------------------------------------------------
  const handleSignUpFormData = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading("Submitting your data...");
    try {
      const response = await apiConnector("POST", auth.SIGNUP_API, {
        name: userSignUpData.name,
        email: userSignUpData.email,
        password: userSignUpData.password,
      });

      if (!response.data.success) {
        alert(response.data.message);
      } else {
        toast.update(loadingToastId, {
          render: "Signup Successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });

        setUserSignUpData({
          name: "",
          email: "",
          password: "",
        });

        console.log("signup response : ", response.data.response);
        navigate("/");
      }
    } catch (error) {
      // console.log("signup response : ", error);
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
    <div className="signUp-container">
      <div className="signUp">
        <h1>Sign up</h1>
        <form action="" onSubmit={(e) => handleSignUpFormData(e)}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={(e) => handleInput(e)}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={(e) => handleInput(e)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your mobile password"
            onChange={(e) => handleInput(e)}
            required
          />

          <button type="submit" className="signUpBtn">
            Signup
          </button>
        </form>
          <p className="alreadyAccount">
            Already account ? <Link to={"/"}>Login</Link>{" "}
          </p>
      </div>
    </div>
  );
};

export default SignUp;
