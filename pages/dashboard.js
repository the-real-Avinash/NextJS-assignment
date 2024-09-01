import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchTasks } from "../store/tasksSlice";
import dynamic from "next/dynamic";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Dynamically import the Pie component to avoid SSR issues
const PieChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Pie),
  {
    ssr: false,
  }
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { pending: 0, completed: 0 }
  );


  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );


  const statusChartData = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        label: "Task Status",
        data: [statusCounts.pending, statusCounts.completed],
        backgroundColor: ["#f87171", "#34d399"], // Colors for pending and completed tasks
        hoverBackgroundColor: ["#ef4444", "#10b981"], // Hover colors
      },
    ],
  };


  const priorityChartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Task Priority",
        data: [priorityCounts.High, priorityCounts.Medium, priorityCounts.Low],
        backgroundColor: ["#f87171", "#fbbf24", "#34d399"], // Colors for priority levels
        hoverBackgroundColor: ["#ef4444", "#f59e0b", "#10b981"], // Hover colors
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-blue-600 text-center">
          Task Dashboard
        </h1>
        {status === "loading" && (
          <p className="text-gray-500">Loading chart data...</p>
        )}
        {status === "failed" && <p className="text-red-500">Error: {error}</p>}
        {status === "succeeded" && (
          <div className="flex justify-between space-x-4">
            <div className="w-full max-w-xs">
              <h2 className="text-2xl font-bold text-center mb-4">
                Task Status
              </h2>
              <PieChart data={statusChartData} />
            </div>
            <div className="w-full max-w-xs">
              <h2 className="text-2xl font-bold text-center mb-4">
                Task Priority
              </h2>
              <PieChart data={priorityChartData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
