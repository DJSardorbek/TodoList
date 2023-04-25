import { Button, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTodosState } from "./redux/reducers/todos";
import { Task, editTodo } from "./redux/actions";
import { Controller, useForm } from "react-hook-form";

type PropsType = {
  setEditModal: any;
};

export default function EditTodo(props: PropsType) {
  const todosState = useSelector(selectTodosState);
  const { id, isDone, isEditing, comments } = todosState.editedTask;
  const dispatch = useDispatch();
  const onSubmit = (data: any) => {
    const editedTodo: Task = {
      id: id,
      title: data.title,
      isDone: isDone,
      isEditing: isEditing,
      comments: comments,
    };
    dispatch(editTodo(editedTodo));
    props.setEditModal(false);
  };
  const { control, handleSubmit, setValue } = useForm({ defaultValues: todosState.editedTask });
  useEffect(() => {
    setValue("title", todosState.editedTask.title); // Set the value of the "title" field
  }, [todosState.editedTask, setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="addComment">
      <Controller
        name="title"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Edit a title"
            variant="outlined"
            fullWidth
            value={field.value}
          />
        )}
      />

      <Button type="submit" variant="contained" color="primary">
        Edit todo
      </Button>
    </form>
  );
}
