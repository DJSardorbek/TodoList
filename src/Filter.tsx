import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { filterTodos } from "./redux/actions";

const validationSchema = yup.object({
  search: yup.string().required("Search is required"),
});
type FormData = {
  search: string;
};

export default function Filter() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();
  const onSubmit = (data: FormData) => {
    let query = "";
    if (data.search.trim() !== "") {
      query = data.search;
    }
    dispatch(filterTodos(query));
  };

  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <Controller
        name="search"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Filter todos..."
            inputProps={{
              "aria-label": "Filter todos...",
              onInput: () => {
                handleSubmit(onSubmit)();
              },
            }}
            {...field}
          />
        )}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
