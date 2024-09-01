import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, deleteTask, updateTaskStatus } from "../store/tasksSlice";
import WarningModal from "./WarningModal";
import { FaPlus } from "react-icons/fa"; // Import the "+" icon from react-icons

const Home = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);

  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleDelete = async () => {
    if (taskToDelete) {
      await dispatch(deleteTask(taskToDelete));
      setTaskToDelete(null);
      setShowModal(false);
    }
  };

  const openModal = (id) => {
    setTaskToDelete(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setTaskToDelete(null);
    setShowModal(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    await dispatch(updateTaskStatus({ id, status: newStatus }));
  };

  const getTaskCardStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-300";
      case "pending":
        return "bg-yellow-100 border-yellow-300";
      default:
        return "bg-white border-gray-300";
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-4 md:mb-0 md:w-1/2"
        />
        <div className="flex space-x-2">
          <Link href="/dashboard">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Go To Dashboard
            </button>
          </Link>
        </div>
      </div>
      {status === "loading" && (
        <p className="text-gray-500">Loading tasks...</p>
      )}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`border rounded p-4 ${getTaskCardStyle(task.status)}`}
            >
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-700">
                Due Date: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                Priority:{" "}
                <span
                  className={`font-bold ${
                    task.priority === "High"
                      ? "text-red-500"
                      : task.priority === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {task.priority}
                </span>
              </p>
              {/* <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={(e) =>
                    handleStatusChange(
                      task._id,
                      e.target.checked ? "completed" : "pending"
                    )
                  }
                  className="mr-2"
                />
                <span className="text-gray-700">Completed</span>
              </div> */}
              <div className="mt-2 flex justify-between items-center">
                <Link href={`/task/${task._id}`}>
                  <button className="text-blue-500">View</button>
                </Link>
                <div>
                  <Link href={`/task/edit/${task._id}`}>
                    <button className="text-yellow-500 mr-2">Edit</button>
                  </Link>
                  <button
                    onClick={() => openModal(task._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <WarningModal
        show={showModal}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
      {/* Floating Action Button */}
      <Link href="/task/new">
        <button className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition duration-300">
          <FaPlus size={24} />
        </button>
      </Link>
    </div>
  );
};

export default Home;
