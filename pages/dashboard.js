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

  // Aggregate task priorities
  const priorities = tasks.reduce(
    (acc, task) => {
      acc[task.priority] += 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  const chartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Task Priority",
        data: [priorities.High, priorities.Medium, priorities.Low],
        backgroundColor: ["#f87171", "#fbbf24", "#34d399"],
        hoverBackgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-blue-600 text-center">
          Task Dashboard
        </h1>
        {status === "loading" && (
          <p className="text-gray-500">Loading chart data...</p>
        )}
        {status === "failed" && <p className="text-red-500">Error: {error}</p>}
        {status === "succeeded" && (
          <div className="relative">
            <PieChart data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
