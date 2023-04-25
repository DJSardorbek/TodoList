import { createReducer } from "@reduxjs/toolkit";
import {
  addTaskItemComments,
  changeEditedTodo,
  changeFilter,
  changeStatus,
  createTask,
  editTodo,
  filterTodos,
  removeTask,
  taskItemEditing,
  tasksFetched,
  tasksFetching,
  tasksFetchingError,
} from "../actions";

interface Task {
  id: string;
  title: string;
  isDone: boolean;
  isEditing: boolean;
  comments: string[];
}

interface TodosState {
  title: string;
  filter: string;
  tasks: Task[];
  filteredTasks: Task[];
  tasksIsLoading: "notLoading" | "loading" | "error";
  editedTask: Task;
}

const initialState: TodosState = {
  title: "",
  filter: "all",
  tasks: [],
  filteredTasks: [],
  tasksIsLoading: "notLoading",
  editedTask: {
    id: "0",
    title: "",
    isDone: false,
    isEditing: false,
    comments: [],
  },
};

export const todos = createReducer(initialState, (builder) => {
  builder
    .addCase(tasksFetching, (state) => {
      state.tasksIsLoading = "loading";
    })
    .addCase(tasksFetched, (state, action) => {
      state.title = action.payload.title;
      state.tasks = action.payload.tasks;
      state.filteredTasks = action.payload.tasks;
      state.tasksIsLoading = "notLoading";
    })
    .addCase(tasksFetchingError, (state) => {
      state.tasksIsLoading = "error";
    })
    .addCase(createTask, (state, action) => {
      state.tasks.push(action.payload);
      state.filteredTasks.push(action.payload);
      state.tasksIsLoading = "notLoading";
    })
    .addCase(removeTask, (state, action) => {
      state.tasks = state.tasks.filter((ts) => ts.id !== action.payload);
      state.filteredTasks = state.filteredTasks.filter(
        (ts) => ts.id !== action.payload
      );
      state.tasksIsLoading = "notLoading";
    })
    .addCase(changeFilter, (state, action) => {
      state.filter = action.payload;
      switch (action.payload) {
        case "all":
          state.filteredTasks = state.tasks;
          break;
        case "active":
          state.filteredTasks = state.tasks.filter((ts) => ts.isDone === false);
          break;
        case "completed":
          state.filteredTasks = state.tasks.filter((ts) => ts.isDone === true);
          break;
        default:
          state.filteredTasks = state.tasks;
          break;
      }
    })
    .addCase(changeStatus, (state, action) => {
      const task = state.tasks.find((ts) => ts.id === action.payload.taskId);
      if (task) {
        task.isDone = action.payload.isDone;
      }
    })
    .addCase(taskItemEditing, (state, action) => {
      state.filteredTasks.forEach((task) => {
        if (task.id !== action.payload) {
          task.isEditing = false;
        } else {
          task.isEditing = !task.isEditing;
        }
      });
    })
    .addCase(addTaskItemComments, (state, action) => {
      const task = state.tasks.find((ts) => ts.id === action.payload.taskId);
      if (task) {
        task.comments.push(action.payload.comment);
      }
    })
    .addCase(changeEditedTodo, (state, action) => {
      state.editedTask = action.payload;
    })
    .addCase(editTodo, (state, action) => {
      const { id, title } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.title = title;
        const flTask = state.filteredTasks.find((ft) => ft.id === id);
        if (flTask) {
          flTask.title = title;
        }
      }

      state.editedTask = {
        id: "0",
        title: "",
        isDone: false,
        isEditing: false,
        comments: [],
      };
    })
    .addCase(filterTodos, (state, action) => {
      if (action.payload === "") {
        state.filteredTasks = state.tasks;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredTasks = state.tasks.filter((todo) =>
          todo.title.toLowerCase().includes(query)
        );
      }
    })
    .addDefaultCase(() => {});
});

export const selectTodosState = (state: { todos: TodosState }) => state.todos;
