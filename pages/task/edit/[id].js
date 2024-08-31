import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskById, updateTask } from "@/store/tasksSlice";

const EditTask = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  // Fetch the task details from the Redux store
  const task = useSelector((state) => state.tasks.selectedTask);
  const taskStatus = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);

  // Initialize form state with task details
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    location: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate || "",
        priority: task.priority || "Low",
        location: task.location || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTask({ id, updatedTask: form }));
      router.push(`/`);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (taskStatus === "loading") {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  if (taskStatus === "failed") {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-semibold">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-gray-700 font-semibold"
          >
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="priority"
            className="block text-gray-700 font-semibold"
          >
            Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-gray-700 font-semibold"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Location (e.g., City or Coordinates)"
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-300"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;
