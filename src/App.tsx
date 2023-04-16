import React, { useState } from "react";
import "./App.css";
import TodoList, { TaskType } from "./TodoList";
import { v1 } from "uuid";

export type FilterValuesType = "all" | "active" | "completed";

let initialState = [
  { id: v1(), title: "CSS", isDone: true, isEditing: false, comments:[] },
  { id: v1(), title: "JS", isDone: true , isEditing: false, comments: []},
  { id: v1(), title: "ReactJS", isDone: false , isEditing: false, comments: []},
  { id: v1(), title: "NodeJS", isDone: false , isEditing: false, comments: []},
];

function App() {
  const [tasks, setTasks] = useState<Array<TaskType>>(initialState);
  const [filter, setFilter] = useState<FilterValuesType>("all");

  const removeTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const addTask = (title: string) => {
    let newTask = { id: v1(), title: title, isDone: false, isEditing: false, comments:[] };
    let newTasks = [newTask, ...tasks];
    setTasks(newTasks);
  }

  const changeStatus = (taskId: string, isDone: boolean) => {
    let task = tasks.find(t => t.id === taskId);
    if(task) {
      task.isDone = isDone;
    }
    setTasks([...tasks]);
  }

  const changeFilter = (value: FilterValuesType) => {
    setFilter(value);
  };

  const taskItemEditHandler = (taskId: string) => {
    tasks.map(task => {
      if(task.id !== taskId) {
        task.isEditing = false;
      }
    });
    let task = tasks.find(t => t.id === taskId);
    if(task) {
      task.isEditing = !task.isEditing;
    }
    setTasks([...tasks]);
  }

  const addCommentsToTodoItem = (taskId: string ,comment: string) => {
    let task = tasks.find(t => t.id === taskId);
    if(task) {
      let newComments = [...task.comments, comment];
      task.comments = newComments
    }
    setTasks([...tasks]);
    console.log(tasks);
  }

  let tasksForTodoList = tasks;
  if (filter === "completed") {
    tasksForTodoList = tasks.filter((t) => t.isDone === true);
  }
  if (filter === "active") {
    tasksForTodoList = tasks.filter((t) => t.isDone === false);
  }
  return (
    <div className="App">
      <TodoList
        title="What to learn"
        tasks={tasksForTodoList}
        removeTask={removeTask}
        changeFilter={changeFilter}
        addTask={addTask}
        changeStatus={changeStatus}
        filter={filter}
        taskItemEditHandler={taskItemEditHandler}
        addCommentsToTodoItem={addCommentsToTodoItem}
      />
    </div>
  );
}

export default App;
