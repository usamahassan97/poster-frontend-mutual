import { createAsyncThunk } from "@reduxjs/toolkit";
import request from "../utills/request";
import { makeQP } from "../utills/common";

const path = "/posts";

export const generateCaption = createAsyncThunk(
  "post/generate_caption",
  (body) =>
    request({
      method: "POST",
      body,
      endpoint: `${path}/caption`,
    })
);

export const createPost = createAsyncThunk("post/create", (formData) =>
  request({ method: "POST", body: formData, endpoint: path })
);

export const getPosts = createAsyncThunk("post/get", (params = {}) =>
  request({ endpoint: `${path}${makeQP(params)}` })
);

export const deletePost = createAsyncThunk("post/delete", (id) =>
  request({ endpoint: `${path}/${id}`, method: "DELETE" })
);
