import { useDispatch } from "react-redux";
import { postsActions, submitComment } from "../store/postSlice";


export default function CommentForm({ postId }) {
    const dispatch = useDispatch();

    function handleSubmit(event) {
        event.preventDefault();
        console.log("submit");
        console.log(event);
        dispatch(submitComment({ postId, body: event.target.comment.value }));
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
          name="comment"
          rows="5"
          defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Veritatis a ipsum nobis dicta quisquam impedit, excepturi quibusdam, praesentium
          obcaecati deserunt possimus doloribus delectus dolorum quod libero
          corrupti voluptates sit. Labore?"
      ></textarea>
            <button>Submit</button>
            <button
                type="button"
                onClick={() => dispatch(postsActions.closeCommentForm(postId))}
            >
                Close
            </button>
        </form>
    );
}