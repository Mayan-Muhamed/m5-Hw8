import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    const response = await axios.get("https://dummyjson.com/posts?limit=10");
    return response.data;
});

export const fetchComments = createAsyncThunk(
    "posts/fetchComments",
    async (postId, { dispatch }) => {
        const response = await axios.get(
            `https://dummyjson.com/comments/post/${postId}`
        );
        dispatch(postsActions.showComments(postId));
        return { id: postId, data: response.data.comments };
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (postId) => {
        const response = await axios.delete(
            `https://dummyjson.com/posts/${postId}`
        );
        return response.data.id;
    }
);

export const submitComment = createAsyncThunk(
    "posts/submitComment",
    async ({ postId, body }, { dispatch }) => {
        console.log({ body });
        const submitResponse = await axios.post(
            `https://dummyjson.com/comments/add`,
            {
                body,
                postId,
                userId: 5,
            }
        );
        const submitResponseData = await submitResponse.data;

        dispatch(postsActions.closeCommentForm(postId));
        dispatch(postsActions.showComments(postId));
        return { id: postId, newComment: submitResponseData };
    }
);

const postsSlice = createSlice({
    name: "posts",
    initialState: [],
    reducers: {
        showComments: (state, action) => {
            state.find((post) => post.id === action.payload).showComments = true;
        },

        hideComments: (state, action) => {
            state.find((post) => post.id === action.payload).showComments = false;
        },

        openCommentForm: (state, action) => {
            state.find((post) => post.id === action.payload).showCommentForm = true;
        },

        closeCommentForm: (state, action) => {
            state.find((post) => post.id === action.payload).showCommentForm = false;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            return action.payload.posts;
        });

        builder.addCase(fetchPosts.pending, (state, action) => {
            console.log("fetching posts");
        });

        builder.addCase(fetchComments.fulfilled, (state, action) => {
            const currentPost = state.find((post) => post.id === action.payload.id);
            currentPost.comments = action.payload.data;
            //currentPost.showComments = true;
        });

        builder.addCase(fetchComments.pending, (state, action) => {
            console.log("fetching comments");
        });

        builder.addCase(deletePost.fulfilled, (state, action) => {
            return state.filter((post) => post.id !== action.payload);
        });

        builder.addCase(deletePost.rejected, (state, action) => {
            console.error("Failed to delete post");
        });

        builder.addCase(submitComment.fulfilled, (state, action) => {
            state.find((post) => post.id === action.payload.id).comments = [
                action.payload.newComment,
            ];
        });

        builder.addCase(submitComment.rejected, (state, action) => {
            console.error("Failed to submit new post");
        });
    },
});

export const postsReducer = postsSlice.reducer;
export const postsActions = postsSlice.actions;