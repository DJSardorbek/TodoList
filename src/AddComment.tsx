import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'

type PropsType = {
    addCommentsToTodoItem: (taskId:string, comment:string) => void;
    taskId: string;
    comments: Array<string>;
    setModal: any;
}

export default function AddComment(props: PropsType) {
    const [comment, setComment] = useState("");
  return (
    <div className='addComment'>
        <ul>
            {props.comments.length > 0 ?
            props.comments.map(comment => (
                <li>{comment}</li>
            )) : <h3>The is no comment yet...</h3>}
        </ul>

       <TextField
          id="outlined-textarea fullWidth"
          label="Add a comment..."
          multiline
          value={comment}
          onChange={(e) => setComment(e.currentTarget.value)}
        />
        <Button variant="contained" onClick={() => {
            props.addCommentsToTodoItem(props.taskId, comment);
            setComment("");
            props.setModal(false);
        }}>Add comment</Button>
    </div>
  )
}
