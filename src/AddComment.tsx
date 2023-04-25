import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTaskItemComments } from "./redux/actions";
import { Comment } from "./redux/actions";

type PropsType = {
  taskId: string;
  comments: Array<string>;
  setModal: any;
};

export default function AddComment(props: PropsType) {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const handleAddTaskItemComments = () => {
    const newComment: Comment = {
      taskId: props.taskId,
      comment: comment,
    };
    dispatch(addTaskItemComments(newComment));
    setComment("");
    props.setModal(false);
  };
  return (
    <div className="addComment">
      <ul>
        {props.comments.length > 0 ? (
          props.comments.map((comment) => <li>{comment}</li>)
        ) : (
          <h3>There is no comment yet...</h3>
        )}
      </ul>

      <TextField
        id="outlined-textarea fullWidth"
        label="Add a comment..."
        multiline
        value={comment}
        onChange={(e) => setComment(e.currentTarget.value)}
      />
      <Button variant="contained" onClick={handleAddTaskItemComments}>
        Add comment
      </Button>
    </div>
  );
}
