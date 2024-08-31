import { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, deleteTask } from "../store/tasksSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task List</h1>
      <div className="flex justify-between mb-4">
        <Link href="/task/new">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Task
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Go To Dashboard
          </button>
        </Link>
      </div>
      {status === "loading" && (
        <p className="text-gray-500">Loading tasks...</p>
      )}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white shadow-md rounded p-4">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-700">{task.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <Link href={`/task/${task._id}`}>
                  <button className="text-blue-500">View</button>
                </Link>
                <div>
                  <Link href={`/task/edit/${task._id}`}>
                    <button className="text-yellow-500 mr-2">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(task._id)}
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
    </div>
  );
};

export default Home;
