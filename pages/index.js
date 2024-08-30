import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const Home = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/tasks");
        setTasks(res.data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks?id=${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task List</h1>
      <Link href="/task/new">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Add Task
        </button>
      </Link>
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
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
