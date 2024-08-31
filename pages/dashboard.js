import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        const taskData = data.data;

        const priorities = taskData.reduce(
          (acc, task) => {
            acc[task.priority] += 1;
            return acc;
          },
          { High: 0, Medium: 0, Low: 0 }
        );

        setChartData({
          labels: ["High", "Medium", "Low"],
          datasets: [
            {
              label: "Task Priority",
              data: [priorities.High, priorities.Medium, priorities.Low],
              backgroundColor: ["#f87171", "#fbbf24", "#34d399"],
              hoverBackgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Task Dashboard
        </h1>
        <div className="relative">
          {Object.keys(chartData).length > 0 ? (
            <Pie data={chartData} />
          ) : (
            <p className="text-center text-gray-500">Loading chart data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
