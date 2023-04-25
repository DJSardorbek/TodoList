import { createAction } from "@reduxjs/toolkit";

export interface Task {
  id: string;
  title: string;
  isDone: boolean;
  isEditing: boolean;
  comments: string[];
}
export interface Tasks {
  title: string;
  tasks: Task[];
}
interface Status {
  taskId: string;
  isDone: boolean;
}
export interface Comment {
  taskId: string;
  comment: string;
}
export const tasksFetching = createAction("todoList/TASKS_FETCHING");
export const tasksFetched = createAction<Tasks>("todoList/TASKS_FETCHED");
export const tasksFetchingError = createAction("todoList/TASKS_FETCHING_ERROR");
export const createTask = createAction<Task>("todoList/CREATE_TASK");
export const removeTask = createAction<string>("todoList/REMOVE_TASK");
export const changeFilter = createAction<string>("todoList/CHANGE_FILTER");
export const changeStatus = createAction<Status>("todoList/CHANGE_STATUS");
export const taskItemEditing = createAction<string>("todoList/TASK_ITEM_EDITING");
export const addTaskItemComments = createAction<Comment>(
  "todoList/ADD_TASK_ITEM_COMMENTS"
);
export const changeEditedTodo = createAction<Task>("todoList/CHANGE_EDITED_TODO");
export const editTodo = createAction<Task>("todoList/CHANGE_TODO");
export const filterTodos = createAction<string>("todoList/FILTER_TODOS");
