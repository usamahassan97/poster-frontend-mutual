import { createAsyncThunk } from "@reduxjs/toolkit";
import request from "../utills/request";
import { makeQP } from "../utills/common";

export const generateCaption = createAsyncThunk(
  "post/generate_caption",
  (body) =>
    request({
      method: "POST",
      body,
      endpoint: "/posts/caption",
    })
);

export const createPost = createAsyncThunk("post/create", (formData) =>
  request({ method: "POST", body: formData, endpoint: "/posts" })
);

export const getPosts = createAsyncThunk("post/get", (params = {}) =>
  request({ endpoint: `/posts${makeQP(params)}` })
);
