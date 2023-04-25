import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Button, TextField, Typography } from "@mui/material";
import MyModal from "./modal/MyModal";
import AddComment from "./AddComment";
import { useSelector, useDispatch } from "react-redux";
import { selectTodosState } from "./redux/reducers/todos";
import {
  Task,
  Tasks,
  changeEditedTodo,
  changeFilter,
  changeStatus,
  createTask,
  removeTask,
  taskItemEditing,
  tasksFetched,
  tasksFetching,
  tasksFetchingError,
} from "./redux/actions";
import { v1 } from "uuid";
import EditTodo from "./EditTodo";
import Filter from "./Filter";

export default function TodoList() {
  const dispatch = useDispatch();
  const todosState = useSelector(selectTodosState);
  const { title, filter, filteredTasks , tasks} = todosState;

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
      const newTask: Task = {
        id: v1(),
        title: newTaskTitle,
        comments: [],
        isDone: false,
        isEditing: false,
      };
      dispatch(createTask(newTask));
      setNewTaskTitle("");
    } else {
      setError("Title is required");
    }
  };
  const onAllClickHandler = () => {
    dispatch(changeFilter("all"));
  };
  const onActiveClickHandler = () => {
    dispatch(changeFilter("active"));
  };
  const onCompletedClickHandler = () => {
    dispatch(changeFilter("completed"));
  };
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [taskId, setTaskId] = useState("");
  let comments = filteredTasks.find((t) => t.id === taskId)?.comments;
  const fetchTasks = async () => {
    try {
      dispatch(tasksFetching());
      const response = await fetch("http://localhost:3001/todos");
      const data: Tasks = await response.json();
      dispatch(tasksFetched(data));
    } catch (error) {
      dispatch(tasksFetchingError());
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div className="addComment">
      <Filter/>
      <div className="todos">
        <Typography variant="h4" mb={2}>
          {title}
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
              variant={filter === "all" ? "contained" : "outlined"}
              onClick={onAllClickHandler}
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "contained" : "outlined"}
              onClick={onActiveClickHandler}
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "contained" : "outlined"}
              onClick={onCompletedClickHandler}
            >
              Completed
            </Button>
          </div>
        </div>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {filteredTasks && filteredTasks.length !== 0 ?
            (filteredTasks.map((task, index) => {
              const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
                dispatch(
                  changeStatus({
                    taskId: task.id,
                    isDone: e.currentTarget.checked,
                  })
                );
              const labelId = `checkbox-list-label-${index}`;

              return (
                <ListItem
                  className={task.isDone ? "is-done" : "todo-item"}
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      color="success"
                      onClick={() => dispatch(taskItemEditing(task.id))}
                    >
                      <CommentIcon />{" "}
                      <div className="comment-count">
                        {task.comments.length}
                      </div>
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
                    {/* Edit */}
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      color="secondary"
                      sx={{ marginLeft: "20px" }}
                      onClick={() => {
                        dispatch(changeEditedTodo(task));
                        setEditModal(true);
                      }}
                    >
                      <EditIcon />{" "}
                    </IconButton>
                    {/* Delete */}
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      color="error"
                      sx={{ marginLeft: "5px" }}
                      onClick={() => dispatch(removeTask(task.id))}
                    >
                      <HighlightOffIcon />{" "}
                    </IconButton>
                  </ListItemButton>
                  {task.isEditing && (
                    <div className="popup-menu">
                      <Button
                        onClick={() => {
                          setModal(true);
                          setTaskId(task.id);
                          dispatch(taskItemEditing(task.id));
                        }}
                        variant="outlined"
                      >
                        Comments
                      </Button>
                    </div>
                  )}
                </ListItem>
              );
            })) : 
              tasks.map((task) => (
                <p>{task.title}</p>
              ))
            }
        </List>
      </div>
      {/* Modal form  for addcomment*/}
      <MyModal modal={modal} setModal={setModal}>
        <AddComment
          taskId={taskId}
          comments={comments || []}
          setModal={setModal}
        />
      </MyModal>

      {/* Modal form  for addcomment*/}
      <MyModal modal={editModal} setModal={setEditModal}>
        <EditTodo setEditModal={setEditModal} />
      </MyModal>
    </div>
  );
}
