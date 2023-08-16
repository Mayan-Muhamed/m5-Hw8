import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./postSlice";

export const store = configureStore({
    reducer: {
        posts: postsReducer,
    },
});