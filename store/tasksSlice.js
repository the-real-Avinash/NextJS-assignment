import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
const initialState = {
  tasks: [],
  selectedTask: null, // for storing the details of a single task
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for fetching tasks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get("/api/tasks");
  return response.data.data;
});

// Async thunk for fetching a single task
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (taskId) => {
    const response = await axios.get(`/api/${taskId}`);
    return response.data.data;
  }
);

// Async thunk for adding a new task
export const addNewTask = createAsyncThunk(
  "tasks/addNewTask",
  async (newTask) => {
    const response = await axios.post("/api/tasks", newTask);
    return response.data.data;
  }
);

// Async thunk for deleting a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId) => {
    await axios.delete(`/api/${taskId}`);
    return taskId;
  }
);

// Async thunk for updating a task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updatedTask }) => {
    const response = await axios.put(`/api/${id}`, updatedTask);
    return response.data.data;
  }
);

// Create the slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle fetchTaskById
      .addCase(fetchTaskById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handle addNewTask
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Handle deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const existingTaskIndex = state.tasks.findIndex(
          (task) => task._id === updatedTask._id
        );
        if (existingTaskIndex >= 0) {
          state.tasks[existingTaskIndex] = updatedTask;
        }
      });
  },
});

export default tasksSlice.reducer;
