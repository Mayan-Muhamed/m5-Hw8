import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    postsActions,
    fetchPosts,
    fetchComments,
    deletePost,
} from "../store/postSlice.js";
import CommentForm from "../Comments/Comments.jsx";

export default function Posts() {
    const posts = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, []);

    function handleToggleComments(post) {
        if (!post.comments) {
            dispatch(fetchComments(post.id));
            return;
        }
        if (post.showComments) {
            dispatch(postsActions.hideComments(post.id));
            return;
        }
        dispatch(postsActions.showComments(post.id));
    }

    function handleDeletePost(post) {
        dispatch(deletePost(post.id));
    }

    function handleAddComment(post) {
        dispatch(postsActions.openCommentForm(post.id));
    }

    return (
        <div>
            {posts.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                    <button onClick={() => handleToggleComments(post)}>
                        {post.showComments ? "Hide comments" : "Show comments"}
                    </button>
                    <button onClick={() => handleDeletePost(post)}>Delete post</button>
                    <button onClick={() => handleAddComment(post)}>Add comment</button>
                    {post.showComments && post.comments && (
                        <Comments>{post.comments}</Comments>
                    )}
                    {post.showCommentForm && <CommentForm postId={post.id} />}
                </div>
            ))}
        </div>
    );
}


function Comments({ children }) {
    return (
        <ul>
            {children.map((comment) => (
                <li key={comment.id}>{comment.body}</li>
            ))}
        </ul>
    );
}
