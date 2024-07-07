import { createAsyncThunk } from "@reduxjs/toolkit";
import request from "../utills/request";

export const loginUser = createAsyncThunk("authorization/login", async ({ body, navigation }) => {
  console.log("body:", body)
  const response = await request({ method: "POST", body, endpoint: "/auth/login" })
  console.log("response:", response)
  const token = response.token;
  localStorage.setItem('token', token);

  if (localStorage.getItem('token') != null) {
    navigation("/home")
  } else {
    navigation("/login")
  }


  return response
})

export const logoutUser = createAsyncThunk("authorization/logout", async ({ navigation }) => {
  // Clear the token from local storage
  localStorage.removeItem('token');

  // Optionally, clear any other user-related data from local storage
  // localStorage.removeItem('userData');

  // Navigate to login page
  navigation("/login");

  return {};
});

export const registerUser = createAsyncThunk("authorization/register", async (body) => {
  console.log("body:", body)
  const response = await request({ method: "POST", body, endpoint: "/auth/signup" })
  console.log("response:", response)
  return response
})

export const onboardFacebook = createAsyncThunk("authorization/register", async () => {
  // console.log("body:", body)
  const response = await request({ method: "GET", endpoint: "/auth/facebook" })
  console.log("response:", response)
  return response
})