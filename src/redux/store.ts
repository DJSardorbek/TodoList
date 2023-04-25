import { configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import { stringMiddleware } from "../middleware/stringMiddleware";
import { todos } from "./reducers/todos";


const middleware = [...getDefaultMiddleware(), stringMiddleware];

export const store = configureStore({
  reducer: { todos },
  middleware,
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
