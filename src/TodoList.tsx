import { ChangeEvent, KeyboardEvent, useState } from "react";
import { FilterValuesType } from "./App";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import { Button, ListItemText, TextField, Typography } from "@mui/material";
import MyModal from "./modal/MyModal";
import AddComment from "./AddComment";
export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
  isEditing: boolean;
  comments: Array<string>;
};

type PropsType = {
  title: string;
  tasks: Array<TaskType>;
  removeTask: (id: string) => void;
  changeFilter: (value: FilterValuesType) => void;
  addTask: (title: string) => void;
  changeStatus: (taskId: string, isDone: boolean) => void;
  filter: FilterValuesType;
  taskItemEditHandler: (taskId: string) => void;
  addCommentsToTodoItem: (taskId: string, comment: string) => void;
};

export default function TodoList(props: PropsType) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value);
  };
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.charCode === 13) {
      addTask();
    }
  };
  const addTask = () => {
    if (newTaskTitle.trim() !== "") {
      props.addTask(newTaskTitle);
      setNewTaskTitle("");
    } else {
      setError("Title is required");
    }
  };
  const onAllClickHandler = () => props.changeFilter("all");
  const onActiveClickHandler = () => props.changeFilter("active");
  const onCompletedClickHandler = () => props.changeFilter("completed");
  const [modal, setModal] = useState(false);
  const [taskId, setTaskId] = useState("");
  let comments = props.tasks.find(t => t.id === taskId)?.comments;
  return (
    <>
      <div className="todos">
        <Typography variant="h4" mb={2}>
          {props.title}
        </Typography>
        <div>
          <TextField
            id="outlined-basic"
            label="Enter a new todo..."
            variant="outlined"
            size="small"
            type="text"
            value={newTaskTitle}
            onChange={onNewTitleChangeHandler}
            onKeyPress={onKeyPressHandler}
            className={error ? "error" : ""}
            style={{ marginRight: "4px" }}
          />
          <Button
            variant="outlined"
            size="large"
            onClick={addTask}
            style={{ marginTop: "-1px" }}
          >
            +
          </Button>
          {error && <div className="error-message">{error}</div>}
          <div className="filters">
            <Button
              variant={props.filter === "all" ? "contained" : "outlined"}
              onClick={onAllClickHandler}
            >
              All
            </Button>
            <Button
              variant={props.filter === "active" ? "contained" : "outlined"}
              onClick={onActiveClickHandler}
            >
              Active
            </Button>
            <Button
              variant={props.filter === "completed" ? "contained" : "outlined"}
              onClick={onCompletedClickHandler}
            >
              Completed
            </Button>
          </div>
        </div>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {props.tasks.map((task, index) => {
            const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
              props.changeStatus(task.id, e.currentTarget.checked);
            const labelId = `checkbox-list-label-${index}`;
            
            return (
              <ListItem
                className={task.isDone ? "is-done" : "todo-item"}
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={() => props.taskItemEditHandler(task.id)}
                  >
                    <CommentIcon />{" "}
                    <div className="comment-count">{task.comments.length}</div>
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton role={undefined} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={task.isDone}
                      onChange={onChangeHandler}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <p className="task-title">{task.title}</p>
                </ListItemButton>
                {task.isEditing && (
                  <div className="popup-menu">
                    <Button onClick={() => {
                      setModal(true);
                      setTaskId(task.id);
                      props.taskItemEditHandler(task.id);

                    }} variant="outlined">
                      Comments
                    </Button>
                  </div>
                )}
              </ListItem>
            );
          })}
        </List>
      </div>
      {/* Modal form */}
      <MyModal modal={modal} setModal={setModal}>
              <AddComment
                addCommentsToTodoItem={props.addCommentsToTodoItem}
                taskId={taskId}
                comments={comments || []}
                setModal={setModal}
              />
            </MyModal>;
    </>
  );
}
